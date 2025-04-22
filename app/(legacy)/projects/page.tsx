"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { AlloProfile } from "@/app/types/allo";
import OrganisationProjects from "@/components/organisationProjects";

export default function Page() {
  const account = useAccount();
  const [profiles, setProfiles] = useState<AlloProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<AlloProfile>();

  useEffect(() => {
    if (!account.address) {
      setIsLoading(false);
      setProfiles([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    getUserAlloProfiles()
      .then((data) => {
        if (data) {
          setProfiles(data.profiles);
        } else {
          setProfiles([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load profiles.");
        setProfiles([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [account.address]);

  async function getUserAlloProfiles() {
    try {
      const response = await fetch(
        `/api/user-allo-profile?walletAddress=${account.address}`
      );
      const alloProfileIds = await response.json();

      const indexerResponse = await fetch("/api/alloProfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alloProfileIds,
          chainId: account.chainId,
        }),
      });

      if (!indexerResponse.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user allo profile");
      }

      const alloProfiles = await indexerResponse.json();
      return alloProfiles;
    } catch (error) {
      console.error("Error fetching user allo profiles:", error);
      throw error;
    }
  }

  return (
    <div className="container mx-auto mt-5">
      {activeProfile ? (
        <OrganisationProjects
          profile={activeProfile}
          setActiveProfile={setActiveProfile}
        />
      ) : (
        <>
          <div className="my-5 text-2xl flex justify-center">
            My Organisations
          </div>
          {isLoading && <p className="text-center">Loading your projects...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!isLoading && !error && profiles.length === 0 && (
            <p className="text-center">
              You haven&apos;t created any projects yet.
            </p>
          )}
          {!isLoading && !error && profiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
              {/* {profiles.map(
            (project) =>
              project.fractions?.data?.[0]?.metadata && (
                <ProjectItem
                  key={project.hypercert_id}
                  project={{
                    id: project.fractions.data[0].metadata.id,
                    recipient: account.address as string,
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
                      bio: project.fractions.data[0].metadata.description ?? "",
                      impactCategory:
                        project.fractions.data[0].metadata.impact_scope ?? [],
                    },
                  }}
                  isLoading={false}
                  buttonText="Manage"
                  buttonLink={`/manage/${project.hypercert_id}`}
                />
              )
          )} */}
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    setActiveProfile(profile);
                  }}
                >
                  {/* Banner Image */}
                  <div className="w-full h-32 bg-gray-200">
                    <img
                      src={
                        profile.metadata?.bannerImg
                          ? `https://d16c97c2np8a2o.cloudfront.net/ipfs/${profile.metadata?.bannerImg}`
                          : "/img/default-banner.jpg"
                      }
                      alt={`${profile.name} banner`}
                      className="w-full h-full object-cover opacity-70 transition-opacity hover:opacity-100"
                    />
                  </div>

                  {/* Logo and Name */}
                  <div className="p-4 relative">
                    <div className="absolute -top-8 left-4">
                      <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white">
                        <img
                          src={
                            profile.metadata?.logoImg
                              ? `https://d16c97c2np8a2o.cloudfront.net/ipfs/${profile.metadata?.logoImg}`
                              : "/img/default-logo.png"
                          }
                          alt={`${profile.name} logo`}
                          className="w-full h-full object-cover opacity-70 transition-opacity hover:opacity-100"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-200">
                        {profile.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
