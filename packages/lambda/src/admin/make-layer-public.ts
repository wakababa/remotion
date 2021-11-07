import {
	AddLayerVersionPermissionCommand,
	PublishLayerVersionCommand,
} from '@aws-sdk/client-lambda';
import {lambda} from 'aws-policies';
import {AwsRegion} from '..';
import {AWS_REGIONS} from '../regions';
import {getLambdaClient} from '../shared/aws-clients';
import {CURRENT_VERSION} from '../shared/constants';

const runtimes: string[] = ['nodejs14.x'];

const layerInfo: {
	[region in AwsRegion]: {layerArn: string; version: number}[];
} = {
	'af-south-1': [],
	'ap-east-1': [],
	'ap-northeast-1': [],
	'ap-northeast-2': [],
	'ap-northeast-3': [],
	'ap-south-1': [],
	'ap-southeast-1': [],
	'ap-southeast-2': [],
	'ca-central-1': [],
	'eu-central-1': [],
	'eu-north-1': [],
	'eu-south-1': [],
	'eu-west-1': [],
	'eu-west-2': [],
	'eu-west-3': [],
	'me-south-1': [],
	'sa-east-1': [],
	'us-east-1': [],
	'us-east-2': [],
	'us-west-1': [],
	'us-west-2': [],
};

const makeLayerPublic = async () => {
	const layers = ['remotion', 'ffmpeg', 'chromium'] as const;
	for (const region of AWS_REGIONS) {
		for (const layer of layers) {
			const layerName = `remotion-binaries-${layer}`;
			const {Version, LayerArn} = await getLambdaClient(region).send(
				new PublishLayerVersionCommand({
					Content: {
						S3Bucket: 'remotionlambda-binaries-' + region,
						S3Key: `remotion-layer-${layer}-v1.zip`,
					},
					LayerName: layerName,
					LicenseInfo:
						layer === 'chromium'
							? 'Compiled from Chromium source. Read Chromium License: https://chromium.googlesource.com/chromium/src/+/refs/heads/main/LICENSE'
							: layer === 'ffmpeg'
							? 'Compiled from FFMPEG source. Read FFMPEG license: https://ffmpeg.org/legal.html'
							: 'Contains UNIX .so files and Noto Sans font. Read Noto Sans License: https://fonts.google.com/noto/specimen/Noto+Sans/about',
					CompatibleRuntimes: runtimes,
					Description: CURRENT_VERSION,
				})
			);
			await getLambdaClient(region).send(
				new AddLayerVersionPermissionCommand({
					Action: lambda.GetLayerVersion,
					LayerName: layerName,
					Principal: '*',
					VersionNumber: Version,
					StatementId: 'public-layer',
				})
			);
			if (!layerInfo[region]) {
				layerInfo[region] = [];
			}

			if (!LayerArn) {
				throw new Error('layerArn is null');
			}

			if (!Version) {
				throw new Error('Version is null');
			}

			layerInfo[region].push({
				layerArn: LayerArn,
				version: Version,
			});
			console.log({LayerArn, Version});
		}
	}
};

makeLayerPublic()
	.then(() => {
		console.log('\n\n\n\n\n');
		console.log(JSON.stringify(layerInfo, null, 2));
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});
