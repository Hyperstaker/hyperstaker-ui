import {
  TextInput,
  Text,
  Textarea,
  Paper,
  Title,
  Stack,
  Button,
  Group,
  FileInput,
} from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { alloRegistryAbi, contracts } from "./data";
import { Abi } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { AlloProfileFormData } from "./OnboardingFlow";

interface CreateAlloProfileProps {
  onNext: () => void;
  onPrevious: () => void;
  alloProfileState: [string, Dispatch<SetStateAction<string>>];
  ipfsHash: [string, Dispatch<SetStateAction<string>>];
  alloForm: UseFormReturn<AlloProfileFormData, any, AlloProfileFormData>;
}

export function CreateAlloProfile({
  onNext,
  onPrevious,
  alloProfileState,
  ipfsHash,
  alloForm,
}: CreateAlloProfileProps) {
  const [alloProfile, setAlloProfile] = alloProfileState;
  const [, setIpfsHash] = ipfsHash;
  const contract = useWriteContract();
  const account = useAccount();
  const wagmiConfig = useConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const form = alloForm;

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("logoImg", file);
      form.setValue("logoImgData", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("bannerImg", file);
      form.setValue("bannerImgData", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const ipfsUpload = async (alloProfileData: AlloProfileFormData) => {
    if (alloProfileData.logoImg) {
      const logoUploadResp = await fetch("/api/ipfs/file", {
        method: "POST",
        body: alloProfileData.logoImg,
      });
      const logoUploadRespData = await logoUploadResp.json();
      alloProfileData["logoImg"] = logoUploadRespData.IpfsHash;
      alloProfileData.logoImgData = "{}";
    }

    if (alloProfileData.bannerImg) {
      const bannerUploadResp = await fetch("/api/ipfs/file", {
        method: "POST",
        body: alloProfileData.bannerImg,
      });
      const bannerUploadRespData = await bannerUploadResp.json();
      alloProfileData["bannerImg"] = bannerUploadRespData.IpfsHash;
      alloProfileData.bannerImgData = "{}";
    }

    const alloProfileMetadata = await fetch("/api/ipfs/json", {
      method: "POST",
      body: JSON.stringify(alloProfileData),
    });
    const alloProfileMetadataResp = await alloProfileMetadata.json();
    setIpfsHash(alloProfileMetadataResp.IpfsHash);
    return alloProfileMetadataResp.IpfsHash;
  };

  const createAlloProfile = async (alloProfileData: AlloProfileFormData) => {
    if (alloProfile) {
      return;
    }

    try {
      const alloMetadataIPFSHash = await ipfsUpload(alloProfileData);
      const tx = await contract.writeContractAsync({
        // Allo registry contract
        address: contracts[account.chainId as keyof typeof contracts]
          .alloRegistry as `0x${string}`,
        abi: alloRegistryAbi as Abi,
        functionName: "createProfile",
        args: [
          BigInt(Date.now().toString()),
          alloProfileData.title,
          {
            pointer: alloMetadataIPFSHash,
            protocol: "1",
          },
          account.address as string,
          alloProfileData.members
            ? alloProfileData.members
            : [account.address as string],
        ],
      });

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: tx,
      });

      const profileId = txReceipt.logs[0]?.topics?.[1];
      if (profileId) {
        setAlloProfile(profileId);
        await saveUserAlloProfile(account.address as string, profileId);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Unable to create Allo profile");
    }
  };

  const saveUserAlloProfile = async (
    walletAddress: string,
    alloProfileId: string
  ) => {
    try {
      const response = await fetch("/api/user-allo-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          alloProfileId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save user allo profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving user allo profile:", error);
      throw error;
    }
  };

  const onSubmit = async (data: AlloProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (alloProfile) {
        await saveUserAlloProfile(account.address as string, alloProfile);
        onNext();
      } else {
        await createAlloProfile(data);
        onNext();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      p="xl"
      radius="lg"
      bg="dark.7"
      style={{ border: "1px solid var(--mantine-color-dark-4)" }}
    >
      {!showCreateForm ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (alloProfile) {
              await saveUserAlloProfile(account.address as string, alloProfile);
              onNext();
            }
          }}
        >
          <Stack gap="xl">
            <Title order={2} c="white">
              Enter your Allo Profile ID
            </Title>
            <Text size="sm" c="dimmed">
              An Allo Profile is a unique, on-chain identifier for your project
              or organization within the Allo Protocol ecosystem. Think of it
              like a GitHub Organization profile - it represents your entity and
              allows you to manage funding pools and build reputation. You can
              learn more in the{" "}
              <a
                href="https://docs.allo.gitcoin.co/overview/registry"
                target="_blank"
                rel="noopener noreferrer"
              >
                Allo documentation
              </a>
              . This profile can be used across many applications in the web3
              ecosystem such as{" "}
              <a
                href="https://grants.gitcoin.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gitcoin Grants rounds
              </a>{" "}
              and{" "}
              <a
                href="https://gap.karmahq.xyz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                KarmaGap
              </a>
              .
            </Text>
            <TextInput
              label="Existing Allo Profile ID"
              placeholder="Enter existing profile ID if available"
              value={alloProfile}
              onChange={(e) => setAlloProfile(e.target.value)}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />
            <Group justify="space-between">
              <Button variant="default" onClick={onPrevious}>
                Previous Step
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                type="submit"
              >
                Next Step
              </Button>
            </Group>
            <Stack align="center" gap="xs">
              <Text size="sm" c="dimmed">
                If you don&apos;t have an Allo Profile ID, we can create one for
                you now.
              </Text>
              <Button variant="link" onClick={() => setShowCreateForm(true)}>
                Create one
              </Button>
            </Stack>
          </Stack>
        </form>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="xl">
            <Title order={2} c="white">
              Create your project
            </Title>
            <Text>
              This information will be used to create your project profile, as
              well as create a profile for your project on Allo Protocol.
            </Text>
            <TextInput
              label="Project Title"
              placeholder="Enter your project title"
              required
              error={form.formState.errors.title?.message}
              {...form.register("title", {
                required: "Title is required",
              })}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <Textarea
              label="Project Description"
              placeholder="Describe your project"
              required
              minRows={4}
              error={form.formState.errors.description?.message}
              {...form.register("description", {
                required: "Description is required",
              })}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <TextInput
              label="Website"
              placeholder="Project website URL"
              {...form.register("website")}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <TextInput
              label="Twitter Handle"
              placeholder="@username"
              {...form.register("projectTwitter")}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <TextInput
              label="GitHub Repository"
              placeholder="Repository URL"
              {...form.register("projectGithub")}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <FileInput
              label="Logo Image"
              placeholder="Upload logo"
              accept="image/*"
              onChange={(file) => handleLogoUpload(file)}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <FileInput
              label="Banner Image"
              placeholder="Upload banner"
              accept="image/*"
              onChange={(file) => handleBannerUpload(file)}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <TextInput
              label="Member Addresses"
              description="Enter the addresses of the members of your project. This will be used to create a profile and a pool for your project on Allo Protocol."
              placeholder="Comma-separated list of addresses"
              {...(form.register("members"),
              {
                onChange: (e) => {
                  form.setValue(
                    "members",
                    e.target.value
                      .split(",")
                      .map((i) => i.trim())
                      .filter((item) => item !== "")
                  );
                },
              })}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <TextInput
              label="Required Credentials"
              placeholder="Comma-separated list of credentials"
              {...(form.register("credentials"),
              {
                onChange: (e) => {
                  form.setValue(
                    "credentials",
                    e.target.value
                      .split(",")
                      .map((i) => i.trim())
                      .filter((item) => item !== "")
                  );
                },
              })}
              styles={{
                label: { color: "var(--mantine-color-gray-4)" },
                input: {
                  backgroundColor: "var(--mantine-color-dark-6)",
                  color: "var(--mantine-color-white)",
                  border: "1px solid var(--mantine-color-dark-4)",
                },
              }}
            />

            <Group justify="space-between">
              <Button variant="default" onClick={onPrevious}>
                Previous Step
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                type="submit"
                loading={isSubmitting}
              >
                {isSubmitting ? "Creating Profile..." : "Next Step"}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
