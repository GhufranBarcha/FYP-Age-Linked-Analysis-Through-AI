import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 1024,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

actual_age = None
predicted_age = None
stage = "greeting"
fallback_mode = False

def get_bot_response(user_input=None):
    global actual_age, predicted_age, stage, fallback_mode

    def greeting_response():
        return (
            "Hello! I'm your Age Analysis Assistant. Let's begin! "
            "What's the child's actual age?"
        )

    def ask_actual_age_response():
        return "Thank you! What's the predicted age from our model?"

    responses = {
        "greeting": greeting_response,
        "ask_actual_age": ask_actual_age_response,
        "ask_predicted_age": analyze_ages,
        "analysis": handle_specific_questions,
    }

    if user_input is None:
        return responses[stage]()
    elif stage == "ask_actual_age":
        actual_age = user_input.strip()
        stage = "ask_predicted_age"
        return responses[stage]()
    else:
        return responses[stage](user_input)

def analyze_ages(user_input):
    global actual_age, predicted_age, stage
    predicted_age = user_input.strip()
    try:
        age_diff = abs(int(actual_age) - int(predicted_age))
        stage = "analysis"
        if age_diff > 2:
            return (
                f"Significant difference: {age_diff} years. "
                "Consult a pediatrician for guidance."
            )
        else:
            return (
                f"Difference: {age_diff} years. Within typical range. "
                "Consult a specialist for peace of mind."
            )
    except ValueError:
        return "Error: Ages must be numbers."

def handle_specific_questions(user_input):
    global fallback_mode
    keywords = {
        "prevent": provide_preventive_measures,
        "improve": provide_improvement_suggestions,
        "develop": provide_developmental_suggestions,
        "monitor": provide_monitoring_advice,
    }
    fallback_mode = True
    return keywords.get(user_input.lower(), model.generate_content)(user_input)

def provide_preventive_measures(user_input):
    fallback_mode = False
    return (
        "Support development with:\n"
        "- Cognitive growth through play.\n"
        "- Social skills through interaction.\n"
        "- Language development through reading."
    )

def provide_improvement_suggestions(user_input):
    fallback_mode = False
    return (
        "Enhance skills with:\n"
        "- Cognitive games.\n"
        "- Interactive reading for language.\n"
        "- Varied environments for learning."
    )

def provide_developmental_suggestions(user_input):
    fallback_mode = False
    return provide_improvement_suggestions(user_input)

def provide_monitoring_advice(user_input):
    fallback_mode = False
    return (
        "Monitor progress through:\n"
        "- Developmental milestones.\n"
        "- Regular assessments.\n"
        "- Journaling observations."
    )

actual_age = input("You: Enter child's actual age: ")
stage = "ask_actual_age"

print("Chatbot: " + get_bot_response() + "\n")
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot session ended.")
        break
    bot_response = get_bot_response(user_input)
    print(f"Bot: {bot_response}")