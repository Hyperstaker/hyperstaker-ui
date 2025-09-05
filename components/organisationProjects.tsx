import { AlloProfile } from "@/app/types/allo";
import { ProjectBanner } from "./ProjectBanner";
import { ProjectAvatar } from "./ProjectAvatar";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { HypercertData } from "@/app/types/hypercerts";
import ProjectItem from "./projectItem";

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

  useEffect(() => {
    const getHypercertIds = async () => {
      const response = await fetch("/api/getProjectDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alloProfileId: profile.id,
          chainId: profile.chainId,
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
              onClick={() => {
                window.location.href = `/organizations/create?alloprofile=${profile.id}`;
              }}
              className="absolute right-0 top-0"
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>

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
