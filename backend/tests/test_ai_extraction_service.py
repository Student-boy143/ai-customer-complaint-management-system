import unittest

from app.ai.groq_client import GroqClient
from app.schemas.ai_extraction import ExtractionRequest
from app.services.ai_extraction_service import AIExtractionService


class AIExtractionServiceTests(unittest.TestCase):
    def test_normalize_response_fills_missing_fields(self) -> None:
        service = AIExtractionService.__new__(AIExtractionService)
        normalized = service.normalize_response({"customer_name": "Jane Doe"})

        self.assertEqual(normalized["customer_name"], "Jane Doe")
        self.assertEqual(normalized["product_name"], "")
        self.assertEqual(normalized["priority"], "")

    def test_empty_text_is_rejected(self) -> None:
        request = ExtractionRequest(text="   ", complaint_id=1)
        service = AIExtractionService.__new__(AIExtractionService)

        with self.assertRaises(Exception):
            service.validate_request(request)

    def test_parse_payload_handles_markdown_json(self) -> None:
        client = GroqClient.__new__(GroqClient)
        payload = client._parse_payload('{\n  "customer_name": "Jane Doe",\n  "description": "Leaking product"\n}')

        self.assertEqual(payload["customer_name"], "Jane Doe")
        self.assertEqual(payload["description"], "Leaking product")

    def test_parse_payload_handles_text_wrapped_in_code_fence(self) -> None:
        client = GroqClient.__new__(GroqClient)
        payload = client._parse_payload('```json\n{"customer_name": "John Doe", "product_name": "Widget"}\n```')

        self.assertEqual(payload["customer_name"], "John Doe")
        self.assertEqual(payload["product_name"], "Widget")


if __name__ == "__main__":
    unittest.main()
