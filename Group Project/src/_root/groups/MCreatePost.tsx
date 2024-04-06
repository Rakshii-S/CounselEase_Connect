import MPostForm from "./MPostForm"

function MCreatePost() {
  return (
    <>
      <div  className="common-container">
        <div className="flex h-18">
            <img
            src="/assets/plus.png"
            alt="add user"
            width={80}
            className="pr-2"
            />
            <p className="p-2 mt-4 text-xl">Create a new post</p>
          </div>
          <MPostForm action="Create"/>
      </div>
    </>
  )
}

export default MCreatePost