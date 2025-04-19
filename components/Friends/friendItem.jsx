import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FriendItem({ friend, actions }) {
  const getInitials = () => {
    const first = friend.first_name?.charAt(0) || "";
    const last = friend.last_name?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={friend.profile_picture || "/placeholder.svg"} alt={`${friend.first_name} ${friend.last_name}`} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {friend.first_name} {friend.last_name}
          </p>
        </div>
      </div>
      {actions}
    </div>
  );
}
