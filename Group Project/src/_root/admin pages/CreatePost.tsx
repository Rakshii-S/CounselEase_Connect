import PostForm from "./PostForm"

function Post() {
  return (
    <>
      <div  className="common-container">
        <div className="flex h-18">
            <img
            src="/assets/plus.png"
            alt="add user"
            className="w-14 h-14 pr-2"
            />
                <div className='flex flex-row justify-between h3-bold md:h3-bold ml-4 mt-2 text-left w-full'>
              <p>Create a new group</p>
              </div>
          </div>
          <PostForm action="Create"/>
      </div>
    </>
  )
}

export default Post