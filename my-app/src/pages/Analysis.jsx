import image1 from "../assets/Group 1000005766.png";
import image2 from "../assets/Group 1000005768.png";
import image3 from "../assets/Group 1000005769.png";

export default function Analysis() {
  return (
    <div className="">
      <div className="flex justify-center">
        <h1 className="text-5xl font-bold underline mainColor mt-[5rem]">
          How It Works
        </h1>
      </div>
      <div className="flex justify-between items-center w-[70%] lg:flex-nowrap flex-wrap mx-auto mt-[8rem]">
        <div className="mt-10">
          <img src={image1} alt="image1" />
          <p className="text-xl text-black max-w-[20rem] mt-10">
            Start by uploading a voice recording or record your child&apos;s
            speech directly on our platform.
          </p>
        </div>
        <div className="mt-10">
          <img src={image2} alt="image1" />
          <p className="text-xl text-black max-w-[20rem] mt-10">
            Our advanced AI analyzes your child&apos;s speech and compares it to
            age-based developmental milestones
          </p>
        </div>
        <div className="mt-10">
          <img src={image3} alt="image1" />
          <p className="text-xl text-black max-w-[20rem] mt-10">
            Receive a detailed analysis with insights on your child&apos;s
            speech progress along with personalized recommendations for
            improvement
          </p>
        </div>
      </div>
    </div>
  );
}
