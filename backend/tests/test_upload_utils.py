import unittest

from app.utils.file_utils import detect_file_type, extract_text_from_eml


class UploadUtilsTests(unittest.TestCase):
    def test_detect_file_type_uses_allowed_extensions(self) -> None:
        self.assertEqual(detect_file_type("report.pdf"), "pdf")
        self.assertEqual(detect_file_type("sample.JPG"), "image")
        self.assertEqual(detect_file_type("message.eml"), "email")

    def test_extract_text_from_eml_returns_plain_text(self) -> None:
        raw_message = b"From: tester@example.com\nSubject: Test\n\nHello from test"
        text = extract_text_from_eml(raw_message)
        self.assertIn("Hello from test", text)


if __name__ == "__main__":
    unittest.main()
