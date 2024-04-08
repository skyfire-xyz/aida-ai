export default function OnboardingStep({
  title,
  description,
  step,
  active,
}: {
  title: string;
  description: string;
  step: string;
  active: boolean;
}) {
  if (active) {
    return (
      <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          {step}
        </span>
        <span>
          <h3 className="font-medium leading-tight">{title}</h3>
          <p className="text-sm">{description}</p>
        </span>
      </li>
    );
  }
  return (
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
      <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
        {step}
      </span>
      <span>
        <h3 className="font-medium leading-tight">{title}</h3>
        <p className="text-sm">{description}</p>
      </span>
    </li>
  );
}
