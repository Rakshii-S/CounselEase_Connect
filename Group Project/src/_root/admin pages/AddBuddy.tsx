import BuddyForm from "./BuddyForm"

function AddBuddy() {
  return (
    <div  className="common-container">
    <div className="flex h-18">
        <img
        src="/assets/plus.png"
        alt="add user"
        width={80}
        className="pr-2"
        />
        <p className="p-2 mt-4 text-xl">Add a Buddy</p>
      </div>
      <BuddyForm action="Create"/>
  </div>
  )
}

export default AddBuddy