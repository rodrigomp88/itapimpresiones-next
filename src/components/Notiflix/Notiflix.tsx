import Notiflix from "notiflix";

export function NotiflixSuccess(textAlert: string) {
  return Notiflix.Notify.success(`${textAlert}`, {
    position: "right-top",
    timeout: 2000,
    fontSize: "16px",
    useIcon: false,
  });
}

export function NotiflixInfo(textAlert: string) {
  return Notiflix.Notify.info(`${textAlert}`, {
    position: "right-top",
    timeout: 2000,
    fontSize: "16px",
    useIcon: false,
  });
}

export function NotiflixFailure(textAlert: string) {
  return Notiflix.Notify.failure(`${textAlert}`, {
    position: "right-top",
    timeout: 2000,
    fontSize: "16px",
    useIcon: false,
  });
}

export function NotiflixWarning(textAlert: string) {
  return Notiflix.Notify.warning(`${textAlert}`, {
    position: "right-top",
    timeout: 2000,
    fontSize: "16px",
    useIcon: false,
  });
}
