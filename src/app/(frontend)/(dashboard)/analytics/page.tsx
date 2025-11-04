import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <Image alt="coming soon" width={100} height={100} src={"/cat.gif"} />
      <span>Coming soon</span>
    </div>
  );
}
