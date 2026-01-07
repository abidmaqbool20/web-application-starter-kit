"use client";
import { useDisableConsoleInProduction } from "../hooks/use-disable-console";
export default function DisableConsoleProvider() {
    useDisableConsoleInProduction();
    return null;
}
