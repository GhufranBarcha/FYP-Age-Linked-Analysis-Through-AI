import bannerImage from "../assets/home.png";

export default function Home() {
  return (
    <div className="">
      <div className="flex lg:flex-row flex-col lg:justify-between overflow-hidden justify-center w-[90%] m-auto mt-[2rem] relative ">
        <div>
          <h1 className="font-[700] lg:text-start text-center  text-[40px] lg:text-[85px] lg:max-w-[586px] lg:leading-[6rem]">
            Empower Your Child&apos;s Speech Development
          </h1>
          <p className="font-[400] text-[20px] lg:text-[32px] max-w-[786px] mt-10 lg:text-start text-center lg:leading-[2.8rem]">
            Our AI-powered platform provides comprehensive speech disorder
            detection, helping you track your child’s speech progress and
            offering tailored exercises for improvement
          </p>
          <div className="flex justify-center">
            <button className="bg-[#AB5CF5] lg:text-[29px] font-[700] text-white mainBtn px-10 py-3 lg:py-3 lg:px-10 mt-10 text-center">
              Analyze Speech Now{" "}
            </button>
          </div>
        </div>
        <div className={`mt-10 lg:mt-0 `}>
          <img
            src={bannerImage}
            alt={bannerImage}
            className="lg:h-[40rem] h-[20rem]"
          />
        </div>
      </div>
    </div>
  );
}
