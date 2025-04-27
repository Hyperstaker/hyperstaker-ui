import { AlloProfile } from "@/app/types/allo";
import { ProjectBanner } from "./ProjectBanner";
import { ProjectAvatar } from "./ProjectAvatar";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { HypercertData } from "@/app/types/hypercerts";
import ProjectItem from "./projectItem";
import { useRouter } from "next/navigation";
import { Modal } from "./ui/Modal";

export default function OrganisationProjects({
  setActiveProfile,
  profile,
}: {
  setActiveProfile: React.Dispatch<
    React.SetStateAction<AlloProfile | undefined>
  >;
  profile: AlloProfile;
}) {
  const [projects, setProjects] = useState<HypercertData[]>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const getHypercertIds = async () => {
      const response = await fetch("/api/getProjectDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alloProfileId: profile.id,
        }),
      });

      const hypercertData = await response.json();
      return hypercertData.hypercertsData;
    };

    getHypercertIds()
      .then((data) => {
        if (data) {
          setProjects(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [profile]);

  const handleCopyProfileId = async () => {
    try {
      await navigator.clipboard.writeText(profile.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy profile ID:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <ProjectBanner
          profileId={profile?.id as string}
          url={
            profile?.metadata?.bannerImg
              ? `https://d16c97c2np8a2o.cloudfront.net/ipfs/${profile.metadata?.bannerImg}`
              : "/img/default-banner.jpg"
          }
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="relative -mt-16 text-center">
          <ProjectAvatar
            className="rounded-full mx-auto w-24 h-24 border-4 border-white dark:border-gray-800"
            address={""}
            url={
              profile?.metadata?.logoImg
                ? `https://d16c97c2np8a2o.cloudfront.net/ipfs/${profile.metadata?.logoImg}`
                : "/img/default-logo.png"
            }
          />
          <div className="relative flex flex-col items-center">
            <Button
              onClick={() => setActiveProfile(undefined)}
              className="absolute left-0 top-0"
            >
              Back
            </Button>

            <h2 className="text-2xl font-bold mt-4 text-center">
              {profile?.name}
            </h2>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="absolute right-0 top-0"
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-gray-100">
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 hover:text-gray-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Create New Project</h2>
            <p className="text-sm text-gray-300">
              Follow these steps to create a new project:
            </p>
          </div>

          <div className="mt-4 space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300 mb-2">Your Profile ID:</p>
              <code className="block p-2 bg-gray-900 rounded text-sm break-all text-gray-100">
                {profile.id}
              </code>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Copy your profile ID using the button below</li>
              <li>
                Click &quot;Create&quot; to go to the project creation page
              </li>
              <li>
                Paste the profile ID in the &quot;Enter your Allo Profile
                ID&quot; section
              </li>
              <li>Follow the remaining steps to create your project</li>
            </ol>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                onClick={handleCopyProfileId}
                variant="secondary"
                className="bg-gray-700 hover:bg-gray-600 text-gray-100"
              >
                {isCopied ? "Copied!" : "Copy Profile ID"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/organizations/create");
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-12 gap-8 mt-8">
        {/* Left Column - Organization Details */}
        <div className="col-span-3">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-300">
              <h5 className="font-semibold mb-2">About</h5>
              <p className="text-sm">
                {profile.metadata?.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Projects */}
        <div className="col-span-9 border border-gray-400 p-2 rounded-xl">
          <h5 className="text-center font-bold mb-6">Projects</h5>

          {isLoading && <p className="text-center">Loading projects...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.map(
              (project) =>
                project.fractions?.data?.[0]?.metadata && (
                  <ProjectItem
                    key={project.hypercert_id}
                    project={{
                      id: project.fractions.data[0].metadata.id,
                      recipient: profile.id,
                      name:
                        project.fractions.data[0].metadata.name ??
                        "Unnamed Project",
                      shortDescription:
                        project.fractions.data[0].metadata.description?.split(
                          "."
                        )[0] ?? "",
                      longDescription:
                        project.fractions.data[0].metadata.description ?? "",
                      avatarUrl: "/img/default-logo.png",
                      bannerUrl: "/img/default-banner.jpg",
                      slug: project.hypercert_id,
                    }}
                    metadata={{
                      data: {
                        bio:
                          project.fractions.data[0].metadata.description ?? "",
                        impactCategory:
                          project.fractions.data[0].metadata.impact_scope ?? [],
                      },
                    }}
                    isLoading={false}
                    buttonText="Manage"
                    buttonLink={`/manage/${project.hypercert_id}`}
                  />
                )
            )}
          </div>

          {!isLoading && projects?.length === 0 && (
            <p className="text-center text-gray-400">
              No projects found for this organization.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
