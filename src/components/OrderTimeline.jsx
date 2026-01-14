const steps = [
  { key: "placed", label: "Order Placed" },
  { key: "packed", label: "Packed" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTimeline({ status }) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex justify-between mt-4">
      {steps.map((step, index) => {
        const active = index <= currentIndex;
        return (
          <div key={step.key} className="flex-1 text-center relative">
            <div
              className={`mx-auto w-8 h-8 rounded-full text-xs flex items-center justify-center font-bold ${
                active ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs mt-1 text-gray-600">
              {step.label}
            </p>

            {index < steps.length - 1 && (
              <div className={`absolute top-4 left-1/2 w-full h-1 ${active ? "bg-green-600" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
