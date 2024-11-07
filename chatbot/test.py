import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model configuration
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

# Initialize variables to store age information and conversation state
actual_age = None
predicted_age = None
stage = "greeting"
fallback_mode = False  # Track whether the bot is in fallback/general response mode

# Define the chatbot logic
def get_bot_response(user_input=None):
    global actual_age, predicted_age, stage, fallback_mode

    if stage == "greeting":
        stage = "ask_actual_age"
        return (
            "👋 Hello! I'm your Age Analysis Assistant, specialized in interpreting age predictions from voice data to support "
            "early childhood development. I'll help you understand any age differences in your child’s predicted and actual age, "
            "and guide you on steps to consider if there are notable differences. Let's begin! Could you please tell me the actual age of the child? 😊"
        )

    elif stage == "ask_actual_age":
        actual_age = user_input.strip()
        stage = "ask_predicted_age"
        return "Thank you! Now, could you tell me the predicted age from our model? 📊"

    elif stage == "ask_predicted_age":
        predicted_age = user_input.strip()
        try:
            age_diff = abs(int(actual_age) - int(predicted_age))
            stage = "analysis"
            if age_diff > 2:
                response = (
                    f"⚠️ There’s a significant difference of {age_diff} years between the actual age and predicted age. "
                    "This may suggest a delay in developmental milestones. Consulting with a pediatrician 🩺 might provide more insights and guidance."
                )
            else:
                response = (
                    f"The difference between the actual age and predicted age is {age_diff} years, which is within a typical range. "
                    "However, if you have concerns, a specialist consultation could offer peace of mind."
                )
            return response + " Now, feel free to ask me any specific questions you might have! 😊"
        except ValueError:
            return "Oops! It seems there was an error with the ages provided. Please make sure they are numbers."

    elif stage == "analysis":
        # Handle specific questions based on keywords
        if "prevent" in user_input.lower():
            return (
                "To support your child's development and address any delays, here are some proactive steps:\n"
                "- Engage in regular play activities to stimulate cognitive growth 🧠.\n"
                "- Encourage social interaction with other children to build social and emotional skills.\n"
                "- Focus on language development through reading and storytelling sessions 📚.\n"
                "Remember, every child develops at their own pace, but consulting a specialist can provide tailored advice! 😊"
            )
        elif "improve" in user_input.lower() or "develop" in user_input.lower():
            return (
                "To support improvement, you might consider activities that enhance specific skills:\n"
                "- For cognitive skills, try puzzles and memory games 🧩.\n"
                "- For language skills, involve your child in interactive reading sessions and repeat simple words.\n"
                "- Ensure they have exposure to varied environments, which can stimulate learning 🌳.\n"
                "I’m here to help with any other specific questions too!"
            )
        elif "monitor" in user_input.lower():
            return (
                "To monitor progress over time:\n"
                "- Keep track of developmental milestones, which can guide you in observing progress.\n"
                "- Use regular assessments, like speech or motor skill evaluations, to check for improvements.\n"
                "- Consider keeping a journal 📔 to note any significant changes or observations.\n"
                "If you’d like more specific guidance, feel free to ask!"
            )
        elif fallback_mode:
            # Fallback response if in fallback mode, offering general AI help
            return (
                "It seems like you're asking something related to your child's development, but I didn't catch the specific area you're concerned about. "
                "If you'd like a general response, type 'r'. Please note that AI may make mistakes, and the response might not be valid for your situation. If you're looking for medical advice, type 'go' to return to the medical assistant.\n"
                "If you want the general response, type 'r', and if you'd like to get back to medical-specific assistance, type 'go'. 😊"
            )
        else:
            # Fallback mode is not active; handle general advice
            return (
                "It seems like you're asking something related to your child's development, but I didn't catch the specific area you're concerned about. "
                "Based on the age difference, here are some general steps you can take to help:\n"
                "- Regular play activities to foster cognitive skills 🧠.\n"
                "- Encouraging social interactions with other children to help emotional development.\n"
                "- Reading and interactive sessions to stimulate language development 📚.\n"
                "If you have any other questions or want advice tailored to a specific area, feel free to ask! 😊"
            )

    elif user_input.lower() == "r":
        # Trigger the fallback mode and respond with a general response from the Gemini API
        fallback_mode = True
        response = model.generate_text(prompt="Provide a simple, general response on early childhood development and age analysis.")
        return (
            f"Here's a general response from the AI: {response.text}\n\n"
            "Please note that AI can make mistakes, and this response might not be perfectly valid. "
            "If you'd like to return to the medical assistant, type 'go'."
        )

    elif user_input.lower() == "go":
        # Reset fallback mode and return to the specific analysis stage
        fallback_mode = False
        return (
            "Returning to the Age Analysis Assistant... Let's continue with your child's age analysis. Please feel free to ask specific questions, and I’ll be happy to assist! 😊"
        )

# Chatbot loop for continuous interaction
print("Chatbot: " + get_bot_response() + "\n")
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot session ended.")
        break
    bot_response = get_bot_response(user_input)
    print(f"Bot: {bot_response}")
