import MainSection from "../MainSection";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../auth/config";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Box } from "@mui/material";
const ViewReports = () => {
  const [childrenData, setChildrenData] = useState([]);

  const fetchChildrenData = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const childrenQuery = query(
        collection(db, "children"),
        where("userId", "==", userId)
      );
      const childrenSnapshot = await getDocs(childrenQuery);
      const childrenData = childrenSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(childrenData);

      setChildrenData(childrenData);
    } catch (error) {
      console.error("Error fetching children data:", error);
      toast.error("Error fetching children data. Please try again.");
    }
  };

  useEffect(() => {
    fetchChildrenData();
    console.log(childrenData);
  }, []);
  const getAgeRange = (predictedAge) => {
    switch (predictedAge) {
      case "A":
        return " (3 - 4 years)";
      case "B":
        return " (5 - 6 years)";
      case "C":
        return " (7 - 8 years)";
      case "D":
        return " (9 - 12 years)";
      default:
        return "Unknown"; // Return a default value if the age doesn't match any case
    }
  };
  console.log(childrenData);
  return (
    <div>
      <Toaster />
      <div className="p-8 w item items-center bg-white DropShadow rounded-xl mb-[4rem] w-full">
        <div className="flex space-x-9 w-full ">
          <Box sx={{ width: "100%" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name of Child</TableCell>
                  <TableCell align="center">Age </TableCell>
                  <TableCell align="center">DOB </TableCell>
                  <TableCell align="center">Test Date </TableCell>
                  <TableCell align="center">Predict Class </TableCell>

                  <TableCell align="center">Predict Age </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {childrenData?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row?.childName}
                    </TableCell>
                    <TableCell align="center">{row?.childAge}</TableCell>
                    <TableCell align="center">{row?.dob}</TableCell>
                    <TableCell align="center">{row?.testDate}</TableCell>
                    <TableCell align="center">{row?.predictedAge}</TableCell>
                    <TableCell align="center">
                      {getAgeRange(row?.predictedAge)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </div>
      </div>
      <MainSection />
    </div>
  );
};

export default ViewReports;
