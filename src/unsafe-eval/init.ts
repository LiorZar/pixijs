import { GlUniformGroupSystem } from '../rendering/renderers/gl/shader/GlUniformGroupSystem';
import { generateUniformsSyncPolyfill } from './generateUniformsSyncPolyfill';

function selfInstall()
{
    Object.assign(GlUniformGroupSystem.prototype,
        {
            _systemCheck()
            {
                // Do nothing, don't throw error
            },

            _generateUniformsSync: generateUniformsSyncPolyfill,
        }
    );
}

selfInstall();
