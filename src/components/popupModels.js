import { TbFileUpload } from "react-icons/tb";

export const PopModel = ({ children, setShowImportContainer }) => {
  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full h-full  flex justify-center items-center z-50  '>
      <div
        className='bg-black/50 w-full h-full'
        onClick={() => setShowImportContainer(false)}
      ></div>
      <div className='absolute bg-white rounded-lg border '>
        <div className='w-full px-5 py-4 font-bold text-xl bg-gray-200'>
          Upload Document
        </div>
        <div className='p-6'>
          <div className='h-full flex flex-col gap-5'>
            <label
              htmlFor='file'
              className='h-1/2 flex flex-col items-center justify-center cursor-pointer  transition-colors duration-200 py-16 px-8 rounded-lg border-2 border-dashed border-gray-400'
            >
              <TbFileUpload className='text-zinc-500 text-3xl' />

              <p className=' text-sm sm:text-xl font-bold'>
                Drag and Drop or
                <span className='text-blue-400'> Click to upload</span>
              </p>
              <p className='text-zinc-400'>
                Support format: CSV or XLS, Max Size: 25MB
              </p>

              <input
                type='file'
                id='file'
                accept='.xlsx'
                className='hidden'
                // onChange={handleImageUpload}
              />
            </label>
            <div className='flex justify-center mt-5 '>
              <button
                // htmlFor='file'
                className='flex gap-8 items-center justify-between w-full cursor-pointer transition-colors duration-200 py-3 px-4 rounded-lg'
              >
                <p className='text-sm font-semibold'>
                  Sample Download <span className='text-blue-400'> here</span>
                </p>
              </button>
            </div>

            {/* <div className='flex justify-center items-center'>
              <div className='w-24 h-24 border-t-2 border-white rounded-full animate-spin'></div>
              <div className='text-white ml-3'>Loading...</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
