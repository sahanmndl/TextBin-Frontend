import Header from "@/components/common/Header.tsx";

const TermsOfServicePage = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 px-4 sm:px-8 py-6 max-w-4xl mx-auto text-sm sm:text-base text-gray-800 space-y-6">
                <h1 className="text-2xl font-semibold mb-4">TextBin Terms of Service</h1>
                <p className="text-gray-600">Last updated: April 5, 2025</p>

                <p>
                    Welcome to <strong>TextBin</strong> (“we”, “our”, or “us”). By accessing or using
                    <a href="https://textbin-pro.vercel.app" target="_blank" className="text-blue-600 underline mx-1">
                        https://textbin-pro.vercel.app
                    </a>
                    (the “Site” or “Service”), you agree to be bound by the following Terms of Service.
                    If you do not agree to these terms, please do not use the Service.
                </p>

                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
                    <p>
                        TextBin is a free, privacy-first, anonymous platform that allows users to write, paste,
                        encrypt, and share text or code snippets with others. The service is intended for lawful and
                        constructive purposes only.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Use of the Service</h2>
                    <p>By using TextBin, you agree that you will not:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Use the service to upload, store, or distribute any content that:</li>
                        <ul className="list-disc list-inside ml-6">
                            <li>Violates any applicable laws or regulations</li>
                            <li>Infringes on intellectual property rights</li>
                            <li>Contains malicious code, viruses, or malware</li>
                            <li>Is defamatory, obscene, abusive, or hateful</li>
                            <li>Promotes violence, terrorism, or discrimination</li>
                            <li>Contains or facilitates the sharing of personal or private data without consent</li>
                        </ul>
                        <li>Use the platform to harass, threaten, or exploit others</li>
                        <li>Attempt to interfere with or compromise the integrity or performance of the Service</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. No Account Required</h2>
                    <p>
                        TextBin is a fully anonymous platform. We do not require user registration or collect
                        identifiable personal information to use the Service. However, uploaded content may still be
                        subject to logging, rate limits, and moderation to prevent abuse.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Content Responsibility</h2>
                    <p>You are solely responsible for any content you create, upload, or share using TextBin.</p>
                    <p>We do not actively monitor content, but we reserve the right to:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Remove or block content that violates these terms</li>
                        <li>Suspend or ban abusive IPs or access patterns</li>
                        <li>Cooperate with law enforcement or third-party rights holders when legally obligated</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
                    <p>
                        You retain ownership of the content you upload. However, by using the service, you grant
                        TextBin a non-exclusive, worldwide license to host and distribute your content solely for the
                        purpose of delivering the service.
                    </p>
                    <p>We do not claim any ownership over your work.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">6. Content Expiry & Deletion</h2>
                    <p>
                        TextBin supports automatic content expiration. You can configure documents to expire after a
                        certain time period. We may also delete content:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                        <li>That violates these Terms</li>
                        <li>Upon receiving valid takedown requests (e.g., DMCA)</li>
                        <li>During infrastructure or storage cleanup</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">7. No Warranty</h2>
                    <p>
                        TextBin is provided “as is” and “as available” with no warranties of any kind. We do not
                        guarantee:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Uptime or availability</li>
                        <li>Security of content</li>
                        <li>Content preservation or retrieval</li>
                    </ul>
                    <p>We disclaim all liability for any loss or damage resulting from the use of our service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
                    <p>
                        Under no circumstances shall TextBin, its developers, or affiliates be liable for:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Indirect, incidental, or consequential damages</li>
                        <li>Loss of data or profits</li>
                        <li>Claims arising from third-party content</li>
                    </ul>
                    <p>Your use of the Service is at your own risk.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">9. Modifications to the Terms</h2>
                    <p>
                        We reserve the right to update these Terms at any time. Continued use of the Service after
                        changes go into effect constitutes your acceptance of the new terms. We recommend checking this
                        page periodically.
                    </p>
                </section>

                {/*<section>*/}
                {/*    <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>*/}
                {/*    <p>*/}
                {/*        These Terms shall be governed and construed in accordance with the laws of{" "}*/}
                {/*        <strong>India</strong>, without regard to its conflict of law provisions.*/}
                {/*    </p>*/}
                {/*    <p>*/}
                {/*        Any disputes arising out of or in connection with the use of the Service shall be subject to*/}
                {/*        the exclusive jurisdiction of the courts located in <strong>YourCity, India</strong>.*/}
                {/*    </p>*/}
                {/*</section>*/}
            </div>
        </main>
    );
};

export default TermsOfServicePage;
