"use client";

import { createBoard } from "@/actions/create-board";
// import FormInput from "./form-input";
// import FormButton from "./form-button";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";

const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log("Success", data);
    },
    onError: (error) => {
      console.log(error, "Error");
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    console.log({ title }, "title");
    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput id="title" errors={fieldErrors} label="Board Title" />
      </div>
      <FormSubmit>Save</FormSubmit>
    </form>
  );
};

export default Form;
