import Image from "next/image"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const Header = ({ headerInfo, photoURL }) => {
  const { first_name, last_name, major } = headerInfo;
  const name = `${first_name} ${last_name}`;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Image
          src={photoURL || "/images/profile.jpg"}
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-500">{major}</p>
        </div>
      </div>

      {/* 3-dots dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full hover:bg-muted">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => alert("Reported")}>
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Header
