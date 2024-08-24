@app.route('/set-limit', methods=['POST'])
@jwt_required()
def set_limit():
    user_email = get_jwt_identity()
    data = request.get_json()
    job_limit = data.get('job_limit', 4000)

    # Save job limit to DynamoDB
    table.update_item(
        Key={'email': user_email},
        UpdateExpression='SET job_limit = :val1',
        ExpressionAttributeValues={':val1': job_limit}
    )
    return jsonify(message="Job limit set successfully"), 200
