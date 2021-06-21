import { AbstractControl } from "@angular/forms";

export const HasCharacter = (control: AbstractControl) => {
  const value = control.value;
  if (!/[a-zA-Z]/.test(value)) {
    return { containCharacter: /[a-zA-Z]/.test(value) };
  }
  return null;
};

export const HasNumber = (control: AbstractControl) => {
  const value = control.value;
  if (!/[0-9]/.test(value)) {
    return { containsNumber: /[0-9]/.test(value) };
  }
  return null;
};

export const ComparePasswords = (control: AbstractControl) => {
  if (control.get("password").value !== control.get("passwordTwo").value) {
    return { notCompared: true };
  }
  return null;
};
