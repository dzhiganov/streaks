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
    <h2 class="text-2xl font-bold mb-4">Privacy Policy</h2>
    <div class="text-gray-500 mb-4">Last updated: 1 March 2025</div>

    <p class="mb-4">
      This Privacy Policy explains how FlowTracks ("we", "us", or "our") collects, uses, discloses,
      and protects your information when you use the FlowTracks web application ("Service"). By
      accessing or using the Service, you consent to the practices described in this Privacy Policy.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h3>
    <p class="mb-4">We collect various types of information when you use our Service, including:</p>

    <h4 class="text-lg font-medium mt-4 mb-2">a. Personal Information</h4>
    <ul class="list-disc list-inside mb-4">
      <li>
        Google-Based Authentication: When you sign in using Google, we collect your authentication
        details including:
        <ul class="list-disc list-inside ml-6">
          <li>Email address (Gmail)</li>
          <li>Profile picture</li>
          <li>Username</li>
        </ul>
      </li>
      <li>
        Tokens: We securely store authentication tokens to facilitate login and session management.
      </li>
    </ul>

    <h4 class="text-lg font-medium mt-4 mb-2">b. Cookies and Tracking Technologies</h4>
    <p class="mb-4">
      We use cookies and similar technologies to enhance your experience, maintain session state,
      and gather usage data. You can manage your cookie preferences via your browser settings.
    </p>
    <p>
      Authorization cookies are essential for the platform to function correctly and do not require
      explicit consent. Blocking these cookies may impact service functionality.
    </p>

    <h4 class="text-lg font-medium mt-4 mb-2">c. Automatically Collected Data</h4>
    <p class="mb-4">
      We may automatically collect information such as your IP address, device details, and browser
      type. This data helps us analyze and improve the Service.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        Authentication and Account Management: To verify your identity and manage your account.
      </li>
      <li>Service Delivery: To provide the FlowTracks service and track usage.</li>
      <li>
        Communication: To update you on new features, service changes, and important notifications.
      </li>
      <li>Service Improvement: To analyze usage patterns and enhance the Service.</li>
      <li>
        Security and Fraud Prevention: To monitor activity, prevent fraud, and safeguard user
        accounts.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">3. How We Share Your Information</h3>
    <p class="mb-4">
      We do not sell or rent your personal information. However, we share your data with third-party
      services:
    </p>
    <ul class="list-disc list-inside mb-4">
      <li>
        Service Providers: We share data with Google Auth (authentication), Google Analytics
        (tracking), Stripe (payments), Vercel & AWS (hosting), and MongoDB (data storage) to operate
        the service.
      </li>
      <li>
        Legal Compliance: We may disclose information if required by law or to protect our rights
        and users.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">4. Data Storage and Security</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        Storage Location: Your data—including tokens, personal information, and session data—is
        securely stored.
      </li>
      <li>
        Data Security: We employ industry-standard measures to protect your data, but no method is
        100% secure.
      </li>
      <li>
        Payment History: We do not store payment history. All transactions are handled by Stripe.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">5. Retention of Data</h3>
    <p class="mb-4">
      We retain your personal information as long as necessary to deliver the Service, comply with
      legal obligations, resolve disputes, and enforce our agreements. Once data is no longer
      needed, it will be securely deleted.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">6. Changes to This Privacy Policy</h3>
    <p class="mb-4">
      We may update this Privacy Policy periodically. Any updates will be posted on this page with a
      revised "Last updated" date. Continued use of the Service after changes constitutes acceptance
      of the updated policy.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">7. Contact Us</h3>
    <p class="mb-4">
      If you have any questions about this Privacy Policy or our data practices, please contact us
      at <a class="link-primary" href="mailto:support@flow-tracks.com">support@flow-tracks.com</a>.
    </p>
  </div>
</template>
