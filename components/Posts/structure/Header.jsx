import Image from "next/image"

const Header = ({name,major,photoURL}) => {
   return (
      <div className="flex items-center space-x-3 mb-4">
         <Image
            src="/images/profile.jpg"
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
   )
}

export default Header