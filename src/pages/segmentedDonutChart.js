const SegmentedDonutChart = ({ title, totalRequests, newRequests, returningRequests }) => {
    // Calculate percentages for chart fill
    const newPercentage = (newRequests / totalRequests) * 100;
    const returningPercentage = (returningRequests / totalRequests) * 100;

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg w-full h-full">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>

            {/* Circular Progress Indicator */}
            <div className="relative mt-4">
                <div className="w-32 h-32 relative rounded-full flex items-center justify-center">
                    {/* Outer Circle Background */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

                    {/* New Requests Arc */}
                    <div
                        className="absolute inset-0 rounded-full border-4 border-blue-500"
                        style={{
                            clipPath: "inset(0 50% 0 0)",
                            transform: `rotate(${(newPercentage / 100) * 360}deg)`
                        }}
                    ></div>

                    {/* Returning Requests Arc */}
                    <div
                        className="absolute inset-0 rounded-full border-4 border-yellow-500"
                        style={{
                            clipPath: "inset(0 0 0 50%)",
                            transform: `rotate(${(returningPercentage / 100) * 360}deg)`
                        }}
                    ></div>

                    {/* Center content */}
                    <div className="absolute flex flex-col items-center justify-center w-28 h-28 bg-white rounded-full">
                        <div className="text-blue-500 mb-1">
                            <i className="fas fa-laptop-code text-2xl"></i> {/* Icon placeholder */}
                        </div>
                        <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Requests</div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>New: {newRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Returning: {returningRequests.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default SegmentedDonutChart;