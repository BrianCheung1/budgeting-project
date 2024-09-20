import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useCSVReader } from "react-papaparse"

type Props = {
  onUpload: (results: any) => void
}

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader()

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button
          size="sm"
          variant="outline"
          className="w-full lg:w-auto dark:bg-primary-500 dark:text-white"
          {...getRootProps()}
        >
          <Upload className="size-4 mr-2" /> Import
        </Button>
      )}
    </CSVReader>
  )
}
