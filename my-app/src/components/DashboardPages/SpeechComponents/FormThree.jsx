import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { db } from "../../../auth/config"; // Adjust the path according to your project structure
import { collection, addDoc, getDocs } from "firebase/firestore";
import toast from "react-hot-toast"; // Import toast

const FormThree = ({ setId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("userId");

      const userAudioCollectionRef = collection(db, "userAudio");

      const querySnapshot = await getDocs(userAudioCollectionRef);

      let userAudioData = null;
      let audioId = null;
      querySnapshot.forEach((doc) => {
        userAudioData = doc.data();
        audioId = doc.id;
      });

      if (userAudioData) {
        const confidence = userAudioData.confidence;
        const predictedAge = userAudioData.predicted_age;

        const childData = {
          ...data,
          userId,
          confidence,
          predictedAge,
          audioId,
        };

        await addDoc(collection(db, "children"), childData);
        console.log("Child data added:", childData);

        // Show success toast
        toast.success("Child data added successfully!");

        // Proceed to next form step
        setId(4); // Assuming setId is defined elsewhere to manage form step
      } else {
        throw new Error("No audio data found");
      }
    } catch (error) {
      console.error("Error adding child data:", error);
      // Show error toast
      toast.error("Error adding child data. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">About Me</h1>
        <p className="text-lg text-[#89868D] mt-3">Mandatory information</p>
      </div>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between flex-wrap space-y-10 lg:space-y-0">
          <div className="flex flex-col ">
            <label
              htmlFor="childName"
              className="text-[#3A3541] text-lg font-bold">
              Child’s name
            </label>
            <input
              type="text"
              {...register("childName", {
                required: "Child's name is required",
              })}
              className="focus:outline-none border-2 w-[33rem] border-[#DBDCDE] py-3 rounded-lg bg-[#DBDCDE] px-3"
            />
            {errors.childName && (
              <span className="text-red-500">{errors.childName.message}</span>
            )}
          </div>
          <div className="flex flex-col ">
            <label
              htmlFor="childAge"
              className="text-[#3A3541] text-lg font-bold">
              Child’s Age
            </label>
            <input
              type="number"
              {...register("childAge", { required: "Child's age is required" })}
              className="focus:outline-none border-2 w-[33rem] border-[#DBDCDE] py-3 rounded-lg bg-[#DBDCDE] px-3"
            />
            {errors.childAge && (
              <span className="text-red-500">{errors.childAge.message}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-[4rem] flex-wrap space-y-10 lg:space-y-0">
          <div className="flex flex-col ">
            <label htmlFor="dob" className="text-[#3A3541] text-lg font-bold">
              Child’s Date of Birth
            </label>
            <input
              type="date"
              {...register("dob", { required: "Date of birth is required" })}
              className="focus:outline-none border-2 w-[33rem] border-[#DBDCDE] py-3 rounded-lg bg-[#DBDCDE] px-3"
            />
            {errors.dob && (
              <span className="text-red-500">{errors.dob.message}</span>
            )}
          </div>
          <div className="flex flex-col ">
            <label
              htmlFor="testDate"
              className="text-[#3A3541] text-lg font-bold">
              Test Date
            </label>
            <input
              type="date"
              {...register("testDate", { required: "Test date is required" })}
              className="focus:outline-none border-2 w-[33rem] border-[#DBDCDE] py-3 rounded-lg bg-[#DBDCDE] px-3"
            />
            {errors.testDate && (
              <span className="text-red-500">{errors.testDate.message}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between item-center mt-[7rem]">
          <button
            type="button"
            onClick={() => setId(2)}
            className="px-10 text-white py-1 bg-[#6E39CB] rounded-lg text-lg ">
            Back
          </button>
          <button
            type="submit"
            className="px-10 text-white py-1 bg-[#6E39CB] rounded-lg text-lg ">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

FormThree.propTypes = {
  setId: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired, // Assuming userId is passed as a prop
};

export default FormThree;
