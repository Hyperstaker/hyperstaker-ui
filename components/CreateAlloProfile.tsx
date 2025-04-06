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
import { useForm } from "react-hook-form";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { alloRegistryAbi, contracts } from "./data";
import { Abi } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";

interface CreateAlloProfileProps {
  onNext: () => void;
  onPrevious: () => void;
  alloProfileState: [string, Dispatch<SetStateAction<string>>];
  ipfsHash: [string, Dispatch<SetStateAction<string>>];
}

const testing = true;

interface AlloProfileFormData {
  title: string;
  description: string;
  website: string;
  projectTwitter: string;
  projectGithub: string;
  logoImg: File | null;
  bannerImg: File | null;
  logoImgData: string;
  bannerImgData: string;
  credentials: string[];
  members: string[];
}

export function CreateAlloProfile({
  onNext,
  onPrevious,
  alloProfileState,
  ipfsHash,
}: CreateAlloProfileProps) {
  const [alloProfile, setAlloProfile] = alloProfileState;
  const [, setIpfsHash] = ipfsHash;
  const contract = useWriteContract();
  const account = useAccount();
  const wagmiConfig = useConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const defaultValues = testing
    ? {
        title: "Climate Action DAO",
        description:
          "A decentralized organization focused on funding and supporting climate change initiatives through blockchain technology. We coordinate resources, validate impact, and ensure transparent distribution of funds to high-impact environmental projects.",
        website: "https://climateactiondao.org",
        projectTwitter: "@ClimateActionDAO",
        projectGithub: "https://github.com/climateactiondao",
        logoImg: null,
        bannerImg: null,
        logoImgData: "",
        bannerImgData: "",
        credentials: ["GitcoinPassport", "ProofOfHumanity", "ENS"],
        members: [
          "0x1234567890123456789012345678901234567890",
          "0x0987654321098765432109876543210987654321",
          "0xabcdef0123456789abcdef0123456789abcdef01",
        ],
      }
    : {};

  const form = useForm<AlloProfileFormData>({
    defaultValues,
  });

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
      const alloMetadataIPFSHash = ipfsUpload(alloProfileData);
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
      }
    } catch (error) {
      console.error(error);
      throw new Error("Unable to create Allo profile");
    }
  };

  const onSubmit = async (data: AlloProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (alloProfile) {
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
          onSubmit={(e) => {
            e.preventDefault();
            if (alloProfile) {
              onNext();
            }
          }}
        >
          <Stack gap="xl">
            <Title order={2} c="white">
              Enter your Allo Profile ID
            </Title>
            <TextInput
              label="Existing Allo Profile ID"
              placeholder="Enter existing profile ID if available"
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
            <Button variant="link" onClick={() => setShowCreateForm(true)}>
              Dont have an Allo Profile ID? Create one
            </Button>
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
              {...form.register("members")}
              onChange={(e) => {
                form.setValue(
                  "members",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((item) => item !== "")
                );
              }}
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
              {...form.register("credentials")}
              onChange={(e) => {
                form.setValue(
                  "credentials",
                  e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter((item) => item !== "")
                );
              }}
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
