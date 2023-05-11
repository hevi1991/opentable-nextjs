import { Loader2Icon } from "lucide-react";

export default function LoadingIcon(props: {
  loading?: boolean;
  [propName: string]: any;
}) {
  const { loading = true, className = "" } = props;
  const clazzName = `${loading ? "animate-spin" : ""} inline ${className}`;
  return <Loader2Icon {...props} className={clazzName} />;
}
