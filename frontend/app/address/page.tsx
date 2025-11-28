"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { getUserInfo, isAuthenticated, UserInfo } from "@/app/utils/auth";

// Address form interface
interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export default function Address() {
    const [address, setAddress] = useState<Address>({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const router = useRouter();

    // Check if the user is logged in and has a session
    useEffect(() => {
        const authenticated = isAuthenticated();
        if (!authenticated) {
            router.push("/log-in");
            return;
        }

        setUserInfo(getUserInfo());
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!userInfo) {
            toast({
                title: "Error",
                description: "You must be logged in to save an address.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            // Add username to the address data
            const addressWithUser = {
                ...address,
                username: userInfo.name || userInfo.username || userInfo.email || "",
            };

            // Save address to MongoDB via API
            const response = await fetch("/api/save-address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressWithUser),
            });

            if (!response.ok) {
                throw new Error("Failed to save address.");
            }

            // On successful save, redirect to payment page
            router.push("/payment");

            toast({
                title: "Address Saved",
                description: "Your address has been saved successfully.",
                variant: "success",
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to save address.";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50">
            <header className="bg-green-800 text-white shadow-md">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold flex items-center hover:text-green-300">
                        <Leaf className="mr-2" />
                        AgriConnect
                    </Link>
                    <Link href="/marketplace" className="text-lg text-white hover:text-green-300">Marketplace</Link>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <Card className="shadow-lg rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-green-800">Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                                        <Input
                                            id="street"
                                            name="street"
                                            value={address.street}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-white border border-gray-300 rounded-md p-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={address.city}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-white border border-gray-300 rounded-md p-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={address.state}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-white border border-gray-300 rounded-md p-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip Code</label>
                                        <Input
                                            id="zip"
                                            name="zip"
                                            value={address.zip}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-white border border-gray-300 rounded-md p-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={address.country}
                                            onChange={handleInputChange}
                                            required
                                            className="bg-white border border-gray-300 rounded-md p-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Address"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="bg-green-800 text-white py-6 mt-12">
                <div className="container mx-auto text-center">
                    <p className="text-lg">AgriConnect &copy; 2024</p>
                </div>
            </footer>
        </div>
    );
}
