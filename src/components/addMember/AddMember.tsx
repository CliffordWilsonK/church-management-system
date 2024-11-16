import { useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function AddMember({ data, closeModal }: { data: any, closeModal: () => void }) {
  let edit: boolean;

  if (data.lastName) {
    edit = true;
  } else {
    edit = false;
  }

  console.log(edit);
  console.log("edit data", data);

  const [profile, setProfile] = useState<any>(null);
  const [welfare, setWelfare] = useState(data.welfare);
  const [lastName, setLastName] = useState(data.lastName);
  const [otherNames, setOtherNames] = useState(data.otherNames);
  const [address, setAddress] = useState(data.address);
  const [sex, setSex] = useState(data.sex);
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth);
  const [nationality, setNationality] = useState(data.nationality);
  const [occupation, setOccupation] = useState(data.occupation);
  const [phone, setPhone] = useState(data.phone);
  const [hometown, setHometown] = useState(data.hometown);
  const [region, setRegion] = useState(data.region);
  const [residence, setResidence] = useState(data.residence);
  const [maritalStatus, setMaritalStatus] = useState(data.maritalStatus);
  const [department, setDepartment] = useState(data.department);
  const [spouseName, setSpouseName] = useState(data.spouseName);
  const [fatherName, setFatherName] = useState(data.fatherName);
  const [motherName, setMotherName] = useState(data.motherName);
  const [childrenName, setChildrenName] = useState(data.childrenName);
  const [nextOfKin, setNextOfKin] = useState(data.nextOfKin);
  const [nextOfKinPhone, setNextOfKinPhone] = useState(
    data.nextOfKinPhone
  );
  const [declaration, setDeclaration] = useState(data.declaration);
  const [dateOfFirstVisit, setDateOfFirstVisit] = useState(
    data.dateOfFirstVisit
  );
  const [dateOfBaptism, setDateOfBaptism] = useState(data.dateOfBaptism);
  const [membership, setMembership] = useState(data.membership);
  const [dateOfTransfer, setDateOfTransfer] = useState(
    data.dateOfTransfer
  );
  const [officerInCharge, setOfficerInCharge] = useState(
    data.officerInCharge
  );
  const [officerSignatureDate, setOfficerSignatureDate] = useState(
    data.officerSignatureDate
  );
  const [headPastorSignatureDate, setHeadPastorSignatureDate] = useState(
    data.headPastorSignatureDate
  );
  const [status, setStatus] = useState(data.status);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function setFiles(e: any) {
    setProfile(e.target.files[0]);
  }

  async function submitHandler(e: any) {
    e.preventDefault();
    
    // Validate required fields first
    if (!lastName || !otherNames || !phone || !residence || !dateOfFirstVisit) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (edit) {
        // ... existing edit logic ...
        uploadActivity().then(() => {
          closeModal(); // Close modal after successful edit
          window.location.reload();
        });
      } else {
        // ... existing add logic ...
        uploadActivity().then(() => {
          closeModal(); // Close modal after successful add
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong");
    }
  }

  return (
    <form className="flex flex-col space-y-6 w-full" onSubmit={submitHandler}>
      {/* Profile Image Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Profile Image</h4>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Upload Profile Image</label>
          <input
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border rounded-lg text-gray-500 text-sm p-2"
            name="profile"
            onChange={setFiles}
            type="file"
            accept="image/*"
            required={!edit}
            title="Select profile image"
          />
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Welfare No.</label>
          <input
              className="select-field"
            name="welfare"
            value={welfare}
            onChange={(e) => setWelfare(e.target.value)}
            type="text"
              placeholder="Enter welfare number"
              title="Enter welfare number"
          />
        </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
          <input
              className="select-field"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
              placeholder="Enter last name"
            title="Enter last name"
          />
        </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Other Names</label>
            <input
              className="select-field"
              name="otherNames"
              type="text"
              value={otherNames}
              onChange={(e) => setOtherNames(e.target.value)}
              required
              placeholder="Enter other names"
              title="Enter other names"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Sex</label>
            <div className="select-container">
              <select
                className="select-field"
                name="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
                title="Select sex"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              className="select-field"
              name="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              title="Select date of birth"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Nationality</label>
            <input
              className="select-field"
              name="nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Enter nationality"
              title="Enter nationality"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              className="select-field"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter phone number"
              title="Enter phone number"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              className="select-field"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter address"
              title="Enter address"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Residence</label>
            <input
              className="select-field"
              name="residence"
              type="text"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              required
              placeholder="Enter residence"
              title="Enter residence"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Hometown</label>
            <input
              className="select-field"
              name="hometown"
              type="text"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              placeholder="Enter hometown"
              title="Enter hometown"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Region</label>
            <input
              className="select-field"
              name="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Enter region"
              title="Enter region"
            />
          </div>
        </div>
      </div>

      {/* Church Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Church Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Department</label>
            <div className="select-container">
              <select
                className="select-field"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                title="Select department"
              >
                <option value="Men Ministry">Men Ministry</option>
                <option value="Women Ministry">Women Ministry</option>
                <option value="Youth Ministry">Youth Ministry</option>
                <option value="Children Ministry">Children Ministry</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Declaration</label>
            <div className="select-container">
              <select
                className="select-field"
                name="declaration"
                value={declaration}
                onChange={(e) => setDeclaration(e.target.value)}
                required
                title="Select declaration status"
              >
                <option value="Signed">Signed</option>
                <option value="Unsigned">Unsigned</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Date of First Visit</label>
            <input
              className="select-field"
              name="dateOfFirstVisit"
              type="date"
              value={dateOfFirstVisit}
              onChange={(e) => setDateOfFirstVisit(e.target.value)}
              required
              title="Select date of first visit"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Date of Baptism</label>
            <input
              className="select-field"
              name="dateOfBaptism"
              type="date"
              value={dateOfBaptism}
              onChange={(e) => setDateOfBaptism(e.target.value)}
              title="Select date of baptism"
            />
          </div>
        </div>
      </div>

      {/* Family Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Family Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Marital Status</label>
            <div className="select-container">
              <select
                className="select-field"
                name="maritalStatus"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                required
                title="Select marital status"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Spouse Name</label>
            <input
              className="select-field"
              name="spouseName"
              type="text"
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
              placeholder="Enter spouse name"
              title="Enter spouse name"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Father's Name</label>
            <input
              className="select-field"
              name="fatherName"
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="Enter father's name"
              title="Enter father's name"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Mother's Name</label>
            <input
              className="select-field"
              name="motherName"
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Enter mother's name"
              title="Enter mother's name"
            />
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {(error || success) && (
        <div
          className={`p-4 rounded-lg ${
            error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          <span>{error || success}</span>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={closeModal}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {edit ? 'Update Member' : 'Add Member'}
      </button>
      </div>
    </form>
  );
}
