import { toast } from "react-hot-toast";
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from "../apiConnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

// getEnrolledCourses
export async function getUserCourses(token, dispatch) {
  dispatch(setProgress(50));
  let result = {
    courses: [],
    courseProgress: [],
  };
  try {
    console.log("🚀 Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      profileEndpoints.GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`, // ✅ FIXED
      }
    );
    console.log("✅ Enrolled Courses Response:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = {
      courses: response.data.data.courses,
      courseProgress: response.data.data.courseProgress,
    };
  } catch (error) {
    console.log("❌ GET_USER_ENROLLED_COURSES_API ERROR:", error);
    toast.error("Could Not Get Enrolled Courses");
  }
  dispatch(setProgress(100));
  return result;
}

// update profile picture
export async function updatePfp(token, pfp) {
  const toastId = toast.loading("Uploading...");
  try {
    const formData = new FormData();
    formData.append("pfp", pfp);
    const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Profile Picture Updated Successfully");
    const imageUrl = response.data.data.image;
    localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), image: imageUrl }));
  } catch (error) {
    console.log("UPDATE_PFP ERROR:", error);
    toast.error(error.response?.data?.message || "Upload failed");
  }
  toast.dismiss(toastId);
}

// update additional details
export async function updateAdditionalDetails(token, additionalDetails) {
  const { firstName, lastName, dateOfBirth, gender, contactNumber, about } = additionalDetails;
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector("PUT", settingsEndpoints.UPDATE_PROFILE_API, {
      firstName, lastName, dateOfBirth, gender, contactNumber, about
    }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Additional Details Updated Successfully");
    const user = JSON.parse(localStorage.getItem("user"));
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.additionalDetails = {
      ...user.additionalDetails,
      dateOfBirth: dateOfBirth || user.additionalDetails.dateOfBirth,
      contactNumber: contactNumber || user.additionalDetails.contactNumber,
      about: about || user.additionalDetails.about,
      gender: gender || user.additionalDetails.gender
    };
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.log("UPDATE_ADDITIONAL_DETAILS ERROR:", error);
    toast.error(error.response?.data?.message || "Update failed");
  }
  toast.dismiss(toastId);
}

// update password
export async function updatePassword(token, password) {
  const { oldPassword, newPassword, confirmPassword: confirmNewPassword } = password;
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector("POST", settingsEndpoints.CHANGE_PASSWORD_API, {
      oldPassword, newPassword, confirmNewPassword
    }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password Updated Successfully");
  } catch (error) {
    console.log("UPDATE_PASSWORD ERROR:", error);
    toast.error(error.response?.data?.message || "Update failed");
  }
  toast.dismiss(toastId);
}

// delete account
export async function deleteAccount(token, dispatch, navigate) {
  const toastId = toast.loading("Deleting...");
  try {
    const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Account Deleted Successfully");
    dispatch(logout(navigate));
  } catch (error) {
    console.log("DELETE_ACCOUNT ERROR:", error);
    toast.error(error.response?.data?.message || "Deletion failed");
  }
  toast.dismiss(toastId);
}

// get instructor dashboard
export async function getInstructorDashboard(token, dispatch) {
  dispatch(setProgress(50));
  let result = [];
  try {
    const response = await apiConnector("GET", profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data.data;
  } catch (error) {
    console.log("GET_INSTRUCTOR_DASHBOARD ERROR:", error);
    toast.error("Could Not Get Instructor Dashboard");
  }
  dispatch(setProgress(100));
  return result;
}
