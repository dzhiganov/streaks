<script setup>
import { ArrowLeft } from '../assets/icons';

definePageMeta({
  auth: false,
});
</script>

<template>
  <div class="container mx-auto max-w-2xl p-6">
    <NuxtLink to="/" class="btn mb-6">
      <ArrowLeft />
      Back to the main page
    </NuxtLink>
    <h2 class="text-2xl font-bold mb-4">Terms and Conditions</h2>
    <div class="text-gray-500 mb-4">Last updated: 1 March 2025</div>

    <p class="mb-4">
      Your use of our website located at
      <a class="link-primary" href="https://flow-track.com">https://flow-track.com</a>
      (and all associated sites linked to it) or services ("FlowTracks", "we", "us", "our")
      signifies that you agree to these Terms and Conditions. If you do not agree, please do not use
      FlowTracks.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">1. Overview of the Service</h3>
    <p class="mb-4">
      FlowTracks is a platform designed to help users track progress toward their goals. Users can:
    </p>
    <ul class="list-disc list-inside mb-4">
      <li>Set personal or professional goals</li>
      <li>Log activities and track progress over time</li>
      <li>Receive analytics and insights to improve productivity</li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">2. Changes to the Terms of Use</h3>
    <p class="mb-4">
      We may update these Terms from time to time. You will be notified of any changes via email. By
      continuing to use FlowTracks after changes are posted, you accept the new terms.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">3. Account Information</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        You must create an account to use FlowTracks. When registering, you may need to provide your
        name, email address, and other contact details.
      </li>
      <li>
        If you use Google authentication, we may receive certain data such as your profile picture
        and email address.
      </li>
      <li>You agree to provide accurate and up-to-date information at all times.</li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">4. Payment & Lifetime Access</h3>
    <ul class="list-decimal list-inside mb-4">
      <li>
        By purchasing the service, you agree to these Terms, the Privacy Policy, Refund Policy,
        Lifetime Access Rules, and any applicable fees.
      </li>
      <li>
        Lifetime access does not mean the app will be available forever. We reserve the right to
        modify, discontinue, or shut down the service at any time.
      </li>
      <li>Pricing for lifetime access or any other payment models may change at any time.</li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">5. Free Trial Policy</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        We offer a 14-day free trial for new users. The trial duration may be changed at any time
        without prior notice.
      </li>
      <li>
        If no subscription is started after the free trial, all user analytics and collected data
        will be deleted a few days after the trial period ends.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">6. Data Collection & Privacy</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        FlowTracks uses cookies to enhance user experience, track behavior, and for analytics
        purposes.
      </li>
      <li>
        We collect visitor behavior, IP addresses, and analytics data solely for improving our
        service.
      </li>
      <li>We do not sell user data to third parties.</li>
      <li>
        FlowTracks complies with GDPR regulations. Users are responsible for obtaining consent from
        visitors if using FlowTracks for analytics on their websites.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        FlowTracks is provided "as is" and may be subject to UI changes, feature updates, and
        temporary downtime.
      </li>
      <li>We do not guarantee that users will achieve their goals by using the app.</li>
      <li>
        We reserve the right to delete user accounts or revoke access without refund, with or
        without reason.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">8. Acceptance of Terms</h3>
    <p class="mb-4">
      BY CLICKING "I ACCEPT," OR BY DOWNLOADING, INSTALLING, OR OTHERWISE USING THE SERVICE, YOU
      AGREE THAT YOU HAVE READ AND UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS, INCLUDING THE
      PRIVACY POLICY.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">9. Contact Us</h3>
    <p class="mb-4">
      If you have any questions, please contact us at
      <a class="link-primary" href="mailto:support@flow-tracks.com">support@flow-tracks.com</a>.
    </p>
  </div>
</template>
