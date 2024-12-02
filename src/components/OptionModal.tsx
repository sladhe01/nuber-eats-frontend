import { DishOption, DishPartsFragment } from "../__generated__/graphql";
import { IFormOrderItem, IOption, IOrderItem } from "../pages/client/restaurant";
import { useForm } from "react-hook-form";
import { FormError } from "./form-error";

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  dish: DishPartsFragment | undefined;
  setOrderItems: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
}

export const OptionModal: React.FC<IProps> = ({ isVisible, onClose, dish, setOrderItems }) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IFormOrderItem>({ mode: "onSubmit", reValidateMode: "onChange" });
  const filterSelectedChoices = (
    options?: DishOption[] | null,
    indexPairs?: [optionIndex: number, choiceIndex: number][]
  ) => {
    if (!options || !indexPairs || indexPairs.length === 0) {
      return undefined;
    }
    const filteredOptions = indexPairs.reduce(
      (acc, [optionIndex, choiceIndex]) => {
        const selectedOption = dish?.options?.[optionIndex];
        const selectedChoice = selectedOption?.choices?.[choiceIndex];
        const existingOption = acc.find((arr) => arr.optIndex === optionIndex);
        if (existingOption) {
          existingOption.option.choices?.push({ name: selectedChoice?.name!, extra: selectedChoice?.extra! });
          return acc;
        } else {
          acc.push({
            option: {
              name: selectedOption?.name!,
              choices: [{ name: selectedChoice?.name!, extra: selectedChoice?.extra! }],
            },
            optIndex: optionIndex,
          });
          return acc;
        }
      },
      [] as { option: IOption; optIndex: number }[]
    );
    return filteredOptions.map((filteredOption) => filteredOption.option);
  };
  const onSubmit = () => {
    const stringifiedIndexPairs = getValues("optionIndex_choiceIndex")
      ? `[${getValues("optionIndex_choiceIndex")}]`
      : undefined;
    const parsedIndexPairs = stringifiedIndexPairs ? JSON.parse(stringifiedIndexPairs) : undefined;
    const orderOption = filterSelectedChoices(dish?.options, parsedIndexPairs);
    setOrderItems((prev) => {
      return [...prev, { dishId: dish?.id!, options: orderOption }];
    });
    onClose();
    reset();
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-black bg-opacity-50 overflow-auto">
      <form
        className="opacity-100 my-20 bg-white w-3/5 items-stretch relative max-h-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="sticky top-0 z-10 bg-white">
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="px-2 mt-3 ml-2"
          >
            X
          </button>
        </div>
        <div className="flex flex-row bg-white w-full">
          <div className="flex flex-col items-center w-1/2">
            <div
              style={{ backgroundImage: `url(${dish?.photo})` }}
              className="bg-center bg-contain bg-no-repeat w-5/6 aspect-square"
            ></div>
          </div>
          <div className="w-1/2">
            <div className="py-4 pl-3 mr-6 border-b-2 border-gray-500">
              <h3 className="text-3xl font-medium mb-2">{dish?.name}</h3>
              <h4 className="text-xl font-medium mb-8">{dish?.description}</h4>
              <h5 className="font-medium">₩{dish?.price}</h5>
            </div>
            {dish?.options && dish.options.length > 0 && (
              <div className="pl-3 py-4">
                <p className="font-medium text-xl mb-3">Options</p>
                {dish.options?.map((option, index) => (
                  <div key={index} className="mb-1 text-lg font-medium  border-b-2 border-gray-500 mr-6 pb-2">
                    <div className="flex items-center">
                      <div className="my-2">{option.name}</div>
                      {option.required && <span className="bg-lime-400 px-2 ml-3 text-sm">Requried</span>}
                    </div>
                    {option.choices?.map((choice, i) => (
                      <div className="text-base font-normal" key={i}>
                        <div className="flex items-center justify-between ml-2 border-t border-gray-200">
                          <div className="mb-1">
                            <p className="font-medium">{choice.name}</p>
                            <p className="text-sm">₩{choice.extra}</p>
                          </div>
                          {option.allowMultipleChoices ? (
                            <input
                              type="checkbox"
                              value={JSON.stringify([index, i])}
                              {...register("optionIndex_choiceIndex", {
                                validate: (_, formValue) => {
                                  if (option.required) {
                                    if (typeof formValue.optionIndex_choiceIndex === "string") {
                                      return JSON.parse(formValue.optionIndex_choiceIndex)[0] === index;
                                    } else if (typeof formValue.optionIndex_choiceIndex === "object") {
                                      return Boolean(
                                        formValue.optionIndex_choiceIndex?.find((indexPair) => {
                                          return JSON.parse(indexPair)[0] === index;
                                        })
                                      );
                                    }
                                  }
                                  return true;
                                },
                              })}
                            />
                          ) : (
                            <input
                              type="radio"
                              value={JSON.stringify([index, i])}
                              {...register("optionIndex_choiceIndex", {
                                validate: (_, formValue) => {
                                  if (option.required) {
                                    if (typeof formValue.optionIndex_choiceIndex === "string") {
                                      return JSON.parse(formValue.optionIndex_choiceIndex)[0] === index;
                                    } else if (typeof formValue.optionIndex_choiceIndex === "object") {
                                      return Boolean(
                                        formValue.optionIndex_choiceIndex?.find((indexPair) => {
                                          return JSON.parse(indexPair)[0] === index;
                                        })
                                      );
                                    }
                                  }
                                  return true;
                                },
                              })}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 flex justify-end items-center z-10 bg-white">
          {errors.optionIndex_choiceIndex?.type === "validate" && (
            <FormError errorMessage="Please choose required option" />
          )}
          <button type="submit" className="px-2 py-1 mr-3 my-3 ml-3 bg-lime-500 hover:bg-green-500 ">
            Add Orders
          </button>
        </div>
      </form>
    </div>
  );
};
