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
    <div class="text-gray-500 mb-4">Last updated: 1 February 2025</div>

    <p class="mb-4">
      This Privacy Policy explains how FlowTrack ("we", "us", or "our") collects, uses, discloses,
      and protects your information when you use the FlowTrack web application ("Service"). By
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
      <li>
        User Balance and Transaction History: We keep records of your credit balance and transaction
        history including purchases and usage metrics.
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
      <li>
        Service Delivery: To provide the FlowTrack service, manage your credits, and track
        transactions.
      </li>
      <li>
        Communication: To update you on new features, service changes, and other important
        notifications.
      </li>
      <li>Service Improvement: To analyze usage patterns and continuously enhance the Service.</li>
      <li>
        Security and Fraud Prevention: To monitor activity, prevent fraud, and safeguard user
        accounts.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">3. How We Share Your Information</h3>
    <p class="mb-4">
      We do not sell or rent your personal information. However, we may share your data in the
      following circumstances:
    </p>
    <ul class="list-disc list-inside mb-4">
      <li>
        Service Providers: We engage third-party providers, such as
        <a class="link-primary" href="https://vercel.com/">Vercel</a> and Google (for
        authentication), who have access only to the information needed to perform tasks on our
        behalf.
      </li>
      <li>
        Legal Compliance: We may disclose your information as required by law, to protect our
        rights, or to ensure the safety of our users and the public.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">4. Data Storage and Security</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        Storage Location: Your data—including tokens, personal information, balance, and transaction
        history—is stored securely on servers hosted by Vercel.
      </li>
      <li>
        Data Security: We employ industry-standard measures to protect your data against
        unauthorized access and breaches. However, no method is 100% secure.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">5. Cookies Policy</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>What Are Cookies?</strong> Cookies are small text files stored on your device to
        improve your browsing experience.
      </li>
      <li>
        <strong>How We Use Cookies:</strong> We use cookies to remember preferences, manage
        sessions, and collect analytics data.
      </li>
      <li>
        <strong>Managing Cookies:</strong> Adjust your browser settings to manage cookies. Disabling
        them might limit some features of the Service.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">6. Retention of Data</h3>
    <p class="mb-4">
      We retain your personal information for as long as necessary to deliver the Service, comply
      with legal obligations, resolve disputes, and enforce our agreements. Once the data is no
      longer needed, it will be securely deleted or anonymized.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">7. Your Data Protection Rights</h3>
    <p class="mb-4">
      Depending on your location, you may have rights regarding your personal data, including:
    </p>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>Access:</strong> You can request details about the personal information we hold
        about you.
      </li>
      <li>
        <strong>Correction:</strong> You can ask us to correct any inaccuracies in your personal
        data.
      </li>
      <li>
        <strong>Deletion:</strong> You may request the deletion of your personal information,
        subject to applicable conditions.
      </li>
      <li>
        <strong>Data Portability:</strong> You can request a copy of your data in a commonly used
        format.
      </li>
    </ul>
    <p class="mb-4">
      To exercise these rights, please contact us at
      <a class="link-primary" href="mailto:streaks-app1@proton.me">streaks-app1@proton.me</a>. We
      will respond to your request in a timely manner.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">8. Changes to This Privacy Policy</h3>
    <p class="mb-4">
      We may update this Privacy Policy periodically to reflect changes in our practices. Any
      updates will be posted on this page along with a revised "Last updated" date. Continued use of
      the Service after such changes constitutes acceptance of the updated policy.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">9. Contact Us</h3>
    <p class="mb-4">
      If you have any questions about this Privacy Policy or our data practices, please contact us
      at <a class="link-primary" href="mailto:streaks-app1@proton.me">streaks-app1@proton.me</a>.
    </p>
  </div>
</template>
