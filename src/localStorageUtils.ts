interface ISettingsData {
  width: number,
  height: number,
  minesPercentage: number,
  sound: boolean,
  music: boolean
}

export const readLocalStorage = (): ISettingsData | null => {
  try {
    const data = localStorage.getItem('dragonsweeper');
    if (data) {
      const settings: ISettingsData = JSON.parse(data);
      return settings;
    }
  } catch {
    console.error(`Unable to save custom game options.
      This is likely due to itch.io's third party cookies policy.
      Enable 3rd party cookies in your browser to use this feature.`);
  }

  return null;
};

export const writeToLocalStorage = (settings: ISettingsData) => {
  try {
    const data = JSON.stringify(settings);
    localStorage.setItem('dragonsweeper', data);
  } catch {
    console.error(`Unable to save custom game options.
      This is likely due to itch.io's third party cookies policy.
      Enable 3rd party cookies in your browser to use this feature.`);
  }
};
