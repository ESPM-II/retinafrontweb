export const Login = () => {
  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:flex items-center justify-normal flex-1 bg-white text-black">
        <img
          src="https://i.ibb.co/th8Y82k/login1.png"
          alt="Login Illustration"
          className="w-full max-w-2xl" // Adjust width as needed
        />
      </div>

      <div class="w-full bg-gray-100 lg:w-3/5 flex place-items-start justify-center">
        <div class="max-w-md w-full p-6">
          {/* Centered Logo */}
          <img
            src="https://i.ibb.co/fQrwb0X/LOGOS-DESKTOP.png"
            alt="Company Logo"
            className="mb-6 mt-24 h-40 w-auto ml-16"
          />
          <h1 class="text-3xl font-semibold mb-6 text-black text-center">
            ¡Bienvenido!
          </h1>
          <div class="mt-4 flex flex-col lg:flex-row items-center justify-between">
            <div class="w-full lg:w-1/2 ml-0 lg:ml-2">
              <button
                type="button"
                class="w-full flex justify-center items-center gap-2 bg-[#199276] text-sm text-white p-2 rounded-md hover:text-black hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                Iniciar Sesión
              </button>
            </div>
            <div class="w-full lg:w-1/2 mb-2 lg:mb-0">
              <button
                type="button"
                class="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="w-4"
                  id="google"
                >
                  <path
                    fill="#fbbb00"
                    d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                  ></path>
                  <path
                    fill="#518ef8"
                    d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                  ></path>
                  <path
                    fill="#28b446"
                    d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                  ></path>
                  <path
                    fill="#f14336"
                    d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                  ></path>
                </svg>{" "}
                Ingresa con Google
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
