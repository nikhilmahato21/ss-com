import Image from "next/image";
import Study from "@/public/Study2.jpg"

export const RightImage = () => {
  return (
    <div className="hidden relative lg:flex lg:w-1/2 h-3/4     border  shadow-sm overflow-hidden flex-col justify-center items-center rounded-2xl">
      <Image
        src={Study}
        alt="Study"
        className="w-full h-full object-cover"
        width={1000}
        height={1000}
        
      />
      <h3 className="text-3xl z-20  bottom-32 absolute  text-center font-bold  text-white/90">
        Organize Your Life with Premium Stationary.
      </h3>
      <p className="text-center  z-20 absolute bottom-20 font-bold text-white/85 mt-4">
        Stay creative and productive with our range of stationary products
        designed to meet all your needs.
      </p>
    </div>
  );
};
