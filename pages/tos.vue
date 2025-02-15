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
    <div class="text-gray-500 mb-4">Last updated: 21 October 2024</div>

    <p class="mb-4">
      Your use of our website located at
      <a class="link-primary" href="https://flow-track.com">https://flow-track.com</a>
      (and all associated sites linked to it) or services ("FlowTrack") signifies that you agree to
      these Terms and Conditions. If you do not agree, please do not use FlowTrack.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">1. Changes to the Terms of Use</h3>
    <p class="mb-4">
      We may update these Terms of Use at any time. By continuing to use FlowTrack after changes are
      posted, you accept the new terms. You can review the current Terms and Conditions at any time
      by reloading this page.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">2. Changes to FlowTrack</h3>
    <p class="mb-4">
      We reserve the right to modify, suspend, or discontinue any aspect of FlowTrack at any time
      without notice. We do not guarantee backward compatibility for any modifications.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">3. Overview of the Service</h3>
    <p class="mb-4">
      FlowTrack ("Service") is a platform designed to help you track, manage, and build your
      personal habits. Our Service enables you to set goals, monitor progress, and gain insights to
      improve your daily routines.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">4. Use of Service</h3>
    <ul class="list-decimal list-inside mb-4">
      <li>
        <strong>Eligibility:</strong> You must be at least 13 years old to use the Service. If you
        are under 18, parental or guardian consent is required.
      </li>
      <li>
        <strong>Account Registration:</strong> You may need to create an account to access certain
        features. Please provide accurate and current information during registration.
      </li>
      <li>
        <strong>Responsibility:</strong> You are responsible for all activity under your account and
        for maintaining the security of your password. Notify us immediately of any unauthorized
        use.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">5. Credit-Based Payments</h3>
    <ul class="list-decimal list-inside mb-4">
      <li>
        <strong>Credits Purchase:</strong> Users may purchase credits through the Service via
        Stripe. Credits unlock premium features within FlowTrack.
      </li>
      <li>
        <strong>Non-Refundable:</strong> Credits are non-refundable. Once purchased, credits cannot
        be returned, exchanged, or refunded.
      </li>
      <li>
        <strong>Payment Terms:</strong> By purchasing credits, you agree to Stripe's terms and must
        provide accurate billing details.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h3>
    <ul class="list-decimal list-inside mb-4">
      <li>
        <strong>Ownership:</strong> All content you generate using FlowTrack remains your property.
        However, you grant us a non-exclusive, worldwide license to use, store, and process your
        input and generated content for service provision and improvement.
      </li>
      <li>
        <strong>Restrictions:</strong> You may not:
        <ul class="list-disc list-inside ml-6">
          <li>
            Use the Service to create content that is illegal, harmful, or infringes on the rights
            of others.
          </li>
          <li>
            Reverse-engineer or attempt to extract the source code of the Service except as
            permitted by law.
          </li>
        </ul>
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">7. AI-Generated Content</h3>
    <p class="mb-4">
      <strong>Nature of AI-Generated Content:</strong> FlowTrack may use AI to provide personalized
      habit recommendations and insights. The content is generated based on user input and may not
      always be accurate or tailored to your specific needs.
    </p>
    <p class="mb-4">
      <strong>Quality Disclaimer:</strong> We do not guarantee the accuracy, completeness, or
      suitability of AI-generated content. You assume all risks related to its use.
    </p>
    <p class="mb-4">
      <strong>Usage of Generated Content:</strong> You are solely responsible for how you use any
      AI-generated content. It should not be considered professional advice.
    </p>

    <h3 class="text-xl font-semibold mt-6 mb-2">8. Privacy and Data Collection</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>Data Collection:</strong> We collect and process personal data in accordance with
        our <a class="link-primary" href="/privacy-policy">Privacy Policy</a>.
      </li>
      <li>
        <strong>Use of Data:</strong> Your data, including inputs and any generated content, is used
        to improve the Service. We will not share your data with third parties without your consent,
        except as required by law.
      </li>
      <li>
        <strong>Data Security:</strong> We employ reasonable measures to protect your data, but
        absolute security cannot be guaranteed.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">9. Service Modifications and Termination</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>Modifications:</strong> We reserve the right to modify or discontinue the Service or
        any part of it at any time, with or without notice.
      </li>
      <li>
        <strong>Termination:</strong> We may suspend or terminate your access to the Service at any
        time, with or without cause or notice.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">10. Limitation of Liability</h3>
    <ul class="list-disc list-inside mb-4">
      <li>
        <strong>No Warranties:</strong> The Service is provided "as is" and "as available," without
        any warranties, express or implied.
      </li>
      <li>
        <strong>Limitation of Liability:</strong> We shall not be liable for any direct, indirect,
        incidental, special, or consequential damages arising from the use or inability to use the
        Service.
      </li>
      <li>
        <strong>No Refunds for Credits:</strong> Once credits are purchased, they are
        non-refundable, regardless of any dissatisfaction with the Service.
      </li>
    </ul>

    <h3 class="text-xl font-semibold mt-6 mb-2">11. Contact Us</h3>
    <p class="mb-4">
      If you have any questions about these Terms, please contact us at
      <a class="link-primary" href="mailto:streaks-app1@proton.me">streaks-app1@proton.me</a>.
    </p>
  </div>
</template>
