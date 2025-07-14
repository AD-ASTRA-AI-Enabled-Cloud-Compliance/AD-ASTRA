'use client'

interface FormData {
    model: string;
    framework: string;
    csp: string;
    file: FileList;
}

import {
    useEffect,
    useState
} from 'react'
import {
    useForm
} from 'react-hook-form'
import {
    Button
} from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    toast
} from 'sonner'
import {
    cn
} from '@/lib/utils'
import {
    Checkbox
} from '@/components/ui/checkbox'
import {
    Input
} from '@/components/ui/input'
import {
    FileInput
} from '@/components/ui/file-input'
import { ModelOptions } from '@/components/chat/ModelOptions'
import { getModelNames } from '@/utils/llama_models'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { useModels } from '@/hooks/useDocSetup';

export const GeneratedForm = () => {

    const [step, setStep] = useState(0)

    // const [models, setModels] = useState<string[]>([]);
    
    const { models, loading, error } = useModels();

    const [docId, setDocId] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");
    const [docOptions, setDocOptions] = useState<string[]>([]);
    // const [loading, setLoading] = useState<boolean>(false);
    const totalSteps = 2


    const form = useForm<FormData>()

    const {
        handleSubmit,
        control,
        reset,
        getValues
    } = form

    const frameworks = ['GDPR', 'PCI', 'HIPAA', 'NIST', 'ISO-127001']
    const providers = ['aws', 'azure', 'gcp']

    const onSubmit = async (formData: any) => {
        if (step < totalSteps - 1) {
            setStep(step + 1)
            return
        }

        const { model, framework, file } = formData

        if (!file || !file[0]) {
            toast.error("File is required.")
            return
        }

        const uploadForm = new FormData()
        uploadForm.append("model", model)
        uploadForm.append("framework", framework)
        uploadForm.append("file", file[0])

        try {
            const res = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: uploadForm,
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("📤 Uploaded successfully")
                setStep(0)
                // reset() // optional
            } else {
                toast.error(data.error || "Upload failed")
            }
        } catch (err) {
            console.error(err)
            toast.error("Network error during upload")
        }
    }


    const handleUpload = async ({
        model,
        framework,
        file,
    }: {
        model: string;
        framework: string;
        file: File;
    }) => {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", model);
        formData.append("framework", framework);
        alert(formData.get("framework"));
        setUploadMessage("Uploading...");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.rules_saved) {
                const docName = data.rules_saved.replace(".json", "");
                setDocId(docName);
                setUploadMessage("✅ Uploaded and processed: " + data.rules_saved);
                setDocOptions((prev) => Array.from(new Set([...prev, docName])));
            } else {
                setUploadMessage("Upload failed");
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error(err);
            setUploadMessage("❌ Error uploading file");
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={cn(
                                "w-4 h-4 rounded-full transition-all duration-300 ease-in-out",
                                index <= step ? "bg-primary" : "bg-primary/30",
                                index < step && "bg-primary"
                            )}
                        />
                        {index < totalSteps - 1 && (
                            <div
                                className={cn(
                                    "w-8 h-0.5",
                                    index < step ? "bg-primary" : "bg-primary/30"
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Framework Documentation Processing</CardTitle>
                    <CardDescription>Current step {step + 1}</CardDescription>
                </CardHeader>
                <CardContent>

                    {step === 0 && (
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
                                <div className="flex items-center space-x-2">

                                    <FormField
                                        control={control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Model</FormLabel>
                                                <FormControl>
                                                    {/* <ModelOptions modelsAvailable={models} /> */}
                                                    <ModelOptions
                                                        modelsAvailable={models}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={control}
                                    name="framework"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Select a framework</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    {frameworks.map((fw) => (
                                                        <FormItem key={fw} className="flex items-center space-x-3 space-y-0">
                                                            <Badge variant="secondary" className="text-xs">

                                                                <FormControl>
                                                                    <RadioGroupItem value={fw} />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{fw}</FormLabel>
                                                            </Badge>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />


                                <FormLabel>Select provider(s)</FormLabel>
                                <FormField
                                    control={control}
                                    name="csp"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Select a cloud provider</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    {providers.map((pv) => (
                                                        <FormItem key={pv} className="flex items-center space-x-3 space-y-0">
                                                            <Badge variant="secondary" className="text-xs">
                                                                <FormControl>
                                                                    <RadioGroupItem value={pv} />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{pv.toUpperCase()}</FormLabel>
                                                            </Badge>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />


                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        className="font-medium"
                                        size="sm"
                                        onClick={handleBack}
                                        disabled={step === 0}
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" size="sm" className="font-medium">
                                        {step >= 1 ? 'Submit' : 'Next'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}


                    {step === 1 && (
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">


                                {/* <FormField
                                    key="HsPScFDE"
                                    control={control}
                                    name="HsPScFDE"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Input 2</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder=""
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                        </FormItem>
                                    )}
                                /> */}


                                <FormField
                                    key="file"
                                    control={control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Input 2</FormLabel>
                                            <FormControl>
                                                <FileInput
                                                    value={field.value?.[0] || null}
                                                    onChange={(file) => field.onChange(file ? [file] : [])}
                                                    accept="image/*, application/pdf"
                                                />
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        className="font-medium"
                                        size="sm"
                                        onClick={handleBack}
                                        disabled={step === 0}
                                        
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" size="sm" className="font-medium">
                                        {step === 1 ? 'Generate Cloud-Specific Rules' : 'Next'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}

                </CardContent>
            </Card>
        </div >
    )
}