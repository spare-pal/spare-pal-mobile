export interface ISignUpStepFirstValues {
  email: string | null
  phone_number: string
  first_name: string
  last_name: string
}

export interface ISignUpStepSecondValues {
  phone_number: string
  password: string
}
export interface ISignUpStepThirdValues {
  last_name: string
  first_name: string
  city: string
  postal_code: string
  address_line_1: string
}
