import Image from "next/image"

const Body = ({bodyInfo}) => {
   const { content } = bodyInfo;
   return (
      <div className="mb-4">
         <p className="mb-3 leading-relaxed">
            {content}
         </p>
         {/* <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
               src="/pic.jpg"
               alt="Post Media"
               fill
               className="object-cover"
            />
         </div> */}
      </div>

   )
}

export default Body