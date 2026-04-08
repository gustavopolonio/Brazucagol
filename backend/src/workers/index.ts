import "@/workers/matchLifecycleWorker";
import "@/workers/autoGoalWorker";
import "@/workers/presenceCleanupWorker";
import "@/workers/leaderboardSnapshotWorker";
import "@/workers/onlinePlayersCountWorker";
import "@/workers/presidentActivity";
import "@/workers/seasonLeaderboardRewardsWorker";
import "@/workers/transferProposalExpiration";

console.log("✅ All workers started");
