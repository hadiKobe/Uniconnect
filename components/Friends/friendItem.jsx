import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function FriendItem({ friend, actions }) {
  const getInitials = () => {
    const first = friend.first_name?.charAt(0) || "";
    const last = friend.last_name?.charAt(0) || "";
    return first + last;
  };

  return (
    <div className="flex items-center justify-between h-16 px-3 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar>
          <AvatarImage
            src={friend.profile_picture}
            alt={`${friend.first_name} ${friend.last_name}`}
          />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="truncate">
          <Link
            href={`/Profile/${friend.id}`}
            prefetch={false}
            className="text-sm font-medium truncate hover:underline"
          >
            <p className="truncate">
              {friend.first_name} {friend.last_name}
            </p>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center min-w-[36px]">
    {actions}
  </div>
    </div>
  );
}
