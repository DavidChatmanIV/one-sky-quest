import VerifiedBadge from "./VerifiedBadge"; // adjust path if in another folder

const UserProfile = ({ user }) => (
<h3 className="text-xl font-bold flex items-center gap-2">
    {user.name} {user.verified && <VerifiedBadge type={user.verifiedBy} />}
</h3>
);
