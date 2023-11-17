import datetime

import boto3
from core.models import AWSLambdaModel

NUM_LAMBDA_INVOCATIONS_PER_MONTH = 1000000

def set_lambda_function_concurrency(concurrency: int):
    client = boto3.client('lambda')
    client.put_function_concurrency(FunctionName='backend-dev', ReservedConcurrentExecutions=concurrency)

def have_crossed_over_to_new_month(last_invocation_date: datetime, current_date: datetime):
    current_month = str(current_date).split('-')[1]
    last_invocation_month = str(last_invocation_date).split('-')[1]
    if current_month != last_invocation_month:
        return True
    return False

class AWSLambdaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)

        # Code to be executed for each request before
        # the view (and later middleware) are called.

        if AWSLambdaModel.objects.count() == 0:
            AWSLambdaModel.objects.create()

        aws_lambda_model = AWSLambdaModel.objects.get(pk=1)
        num_aws_lambda_invocations = aws_lambda_model.num_invocations
        print(num_aws_lambda_invocations)
        if num_aws_lambda_invocations >= NUM_LAMBDA_INVOCATIONS_PER_MONTH:
            set_lambda_function_concurrency(0)

        if have_crossed_over_to_new_month(aws_lambda_model.last_invocation_date, datetime.datetime.utcnow()):
            aws_lambda_model.reset_num_invocations()
            aws_lambda_model.save()
            set_lambda_function_concurrency(10)

        aws_lambda_model.increment_num_invocations()
        aws_lambda_model.save()

        return response