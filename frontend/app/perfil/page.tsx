import { GameLayout } from "@/components/layout/GameLayout";
import { PlayerProfile } from "@/components/profile/PlayerProfile";
import { demoPlayerProfileData } from "@/components/profile/profileDemoData";

export default function ProfilePage() {
  const isLoggedIn = true;
  const authenticatedPlayerId = "player-7";
  const viewedProfilePlayerId = "player-7";
  const isViewingOwnProfile =
    isLoggedIn && authenticatedPlayerId === viewedProfilePlayerId;

  return (
    <GameLayout>
      <PlayerProfile
        isViewingOwnProfile={isViewingOwnProfile}
        profileData={demoPlayerProfileData}
      />
    </GameLayout>
  );
}
