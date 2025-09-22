import { atomWithStorage } from "jotai/utils";

import { currencyKey } from "../constants";

export const currencyAtom = atomWithStorage(currencyKey, "USD");
