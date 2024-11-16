import Link from "next/link";
import Image from "next/image";

export default function ViewMember(props: any) {
  return (
    // <div className="w-[50%] rounded border p-5 h-[100vh] overflow-auto text-sm">
    <form className="flex flex-col flex-wrap mt-10 p-5">
      <div className="flex flex-col my-5 justify-center items-center">
        {/* <label className="font-bold">Profile</label> */}
        <Link href={props.data.imageUrl}>
          <Image
            className="h-20 w-20"
            src={props.data.imageUrl}
            alt="logo"
            width={30}
            height={30}
          />
        </Link>
        <span className="font-bold my-4">{`${props.data.lastName} ${props.data.otherNames}`}</span>
      </div>

      {/* <div>
          <span className="font-bold ml-10">{`${props.data.lastName} ${props.data.otherNames}`}</span>
        </div> */}

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Welfare No.</label>
          <span>{props.data.welfare}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Last Name</label>
          <span>{props.data.lastName}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Other Names</label>
          <span>{props.data.otherNames}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Address</label>
          <span>{props.data.address}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Sex</label>
          <span>{props.data.sex}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Date of Birth</label>
          <span>{props.data.dateOfBirth}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Nationality</label>
          <span>{props.data.nationality}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Occupation</label>
          <span>{props.data.occupation}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Phone Number</label>
          <span>{props.data.phone}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Hometown</label>
          <span>{props.data.hometown}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Region</label>
          <span>{props.data.region}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Residence</label>
          <span>{props.data.residence}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Marital Status</label>
          <span>{props.data.maritalStatus}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Department</label>
          <span>{props.data.department}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Spouse Name</label>
          <span>{props.data.spouseName}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Fathers Name</label>
          <span>{props.data.fatherName}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Mothers Name</label>
          <span>{props.data.motherName}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Children Name</label>
          <span>{props.data.childrenName}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Next of Kin</label>
          <span>{props.data.nextOfKin}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Next of Kin Telephone</label>
          <span>{props.data.nextOfKinPhone}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Declaration</label>
          <span>{props.data.declaration}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Date of First Visit</label>
          <span>{props.data.dateOfFirstVisit}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Date of Baptism</label>
          <span>{props.data.dateOfBaptism}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Membership</label>
          <span>{props.data.membership}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Date of Transfer</label>
          <span>{props.data.dateOfTransfer}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">Officer in Charge</label>
          <span>{props.data.officerInCharge}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Officer Signature Date</label>
          <span>{props.data.officerSignatureDate}</span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-right">
            Head Pastor Signature Date
          </label>
          <span>{props.data.headPastorSignatureDate}</span>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label className="font-bold">Status</label>
          <span>{props.data.status}</span>
        </div>
      </div>
    </form>
    // </div>
  );
}
