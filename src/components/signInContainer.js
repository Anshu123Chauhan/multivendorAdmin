import { useLocation } from "react-router-dom";

export const SignInContainer = ({
  children,
  title,
  imageText1,
  imageText2,
  logo,
}) => {
  const location = useLocation().pathname;
  const isForgot = location === "/forgetpassword";
  return (
    <div className='relative  h-screen flex justify-center items-center bg-white  '>
      <div className='md:w-[90%] w-11/12 lg:w-[60%]  md:h-[80%] lg:h-[55%] rounded-xl border  shadow-lg overflow-hidden '>
        <div className={`flex w-full h-full items-center justify-center`}>
          <div className='md:w-[60%] md:block hidden h-full relative loginContainer'>
            <div
              className={`absolute bottom-20 left-10  text-white text-3xl lg:text-6xl font-bold uppercase `}
            >
              <p>{imageText1} </p> <p> {imageText2} </p>
            </div>
          </div>
          <div className=' h-full w-full  md:w-[40%] bg-white px-6 py-5 flex flex-col  rounded-lg p-4'>
            <div className='w-full h-full'>
              <div className='flex justify-center '>
                <img src={logo} className='h-24' alt='Logo' />
              </div>
              <div className='flex flex-col h-full w-full justify-center'>
                <div className='text-center'>
                  <p className='font-bold text-xl md:text-2xl lg:text-3xl '>
                    {title}
                  </p>
                </div>
                <div className='flex justify-center mt-3 '>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
